using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json; // JsonConvert
using Newtonsoft.Json.Linq; // JObject, JArray

namespace API.Services {
    public class ChessStatsService : IChessStatsService {
        HttpClient _client;
        private const string baseUrl = "https://api.chess.com/pub/player/";
        private const string content = "/games/archives";
        private string username;
        private string endpoint;

        // The last played game a user played that is stored in the database
        private int lastPlayedGameEpoch;
        


        // All known configurations we care about (double check to make sure none are missing)
        // rules:time control:time class
        // This set is used when a game is being parsed to see if we even want to parse results further

        private readonly HashSet<string> validGameConfigurations = new HashSet<string>{
            
            // Bullet
            // "chess:10:bullet", // doesn't exist?
            "chess:30:bullet", // 30 seconds
            "chess:60:bullet", // 1 minute
            "chess:60+1:bullet", // 1 minute + 1 second per move
            "chess:120+1:bullet", // 2 minutes + 1 second per move
            // "chess:120:bullet", // doesn't exist?

            // Blitz
            "chess:180:blitz",
            "chess:300:blitz",
            "chess:480:blitz",
            "chess:600:blitz",
            
            // Rapid
            "chess:600:rapid", // 10 minute game
            "chess:900:rapid", // 15 minute
            "chess:1200:rapid", // 20 minute
            "chess:1800:rapid", // 30 minute
            "chess:3600:rapid", // 1 hour

            // Daily
            "chess:1/86400:daily", // 1 day per move
            "chess:1/172800:daily", // 2 days
            "chess:1/259200:daily", // 3 days
            "chess:1/432000:daily", // 5 days 
            "chess:1/604800:daily", // 7 days
            "chess:1/1209600:daily", // 14 days
        };

        // All known game configurations
        // There are just too many possible configurations to care about them all
        // For example the amount of additional seconds added can be variable
        private readonly HashSet<string> gameConfigurations = new HashSet<string>{
            // -- Chess -- //
            
            // Bullet
            "chess:10:bullet", // doesn't exist?
            "chess:30:bullet", // 30 seconds
            "chess:60:bullet", // 1 minute
            "chess:60+1:bullet", // 1 minute + 1 second per move
            "chess:120+1:bullet", // 2 minutes + 1 second per move
            "chess:120:bullet", // doesn't exist?

            // Blitz
            "chess:180:blitz",
            "chess:300:blitz",
            "chess:480:blitz",
            "chess:600:blitz",
            "chess:180+1:blitz",
            "chess:180+2:blitz",
            "chess:180+5:blitz",
            "chess:300+1:blitz",
            "chess:300+2:blitz",
            "chess:300+3:blitz",
            "chess:300+5:blitz",
            "chess:600+2:blitz",
            
            // Rapid
            "chess:600:rapid", // 10 minute game
            "chess:900:rapid", // 15 minute
            "chess:1200:rapid", // 20 minute
            "chess:1800:rapid", // 30 minute
            "chess:3600:rapid", // 1 hour
            "chess:600+2:rapid",
            "chess:600+5:rapid",
            "chess:600+3:rapid",
            "chess:600+10:rapid",
            "chess:600+15:rapid",
            "chess:900+2:rapid",
            "chess:900+3:rapid",
            "chess:900+10:rapid",
            "chess:1200+10:rapid",
            "chess:1500+10:rapid",
            "chess:2700+45:rapid", // 45 minutes + 45 seconds per move
            "chess:3600+45:rapid",

            // Daily
            "chess:1/86400:daily", // 1 day per move
            "chess:1/172800:daily", // 2 days
            "chess:1/259200:daily", // 3 days
            "chess:1/432000:daily", // 5 days 
            "chess:1/604800:daily", // 7 days
            "chess:1/1209600:daily", // 14 days

            // -- Chess 960 -- //


            // -- Bughouse -- //


            // -- King of the hill -- //

            // -- Three check -- //

            /*
            [0] [string]:"chess:180:blitz"
            [1] [string]:"chess:60:bullet"
            [2] [string]:"chess:1/259200:daily"
            [3] [string]:"chess:1/1209600:daily"
            [4] [string]:"chess:1/172800:daily"
            [5] [string]:"chess:1/86400:daily"
            [6] [string]:"chess:1/432000:daily"
            [7] [string]:"chess:1/604800:daily"
            [8] [string]:"chess960:1/259200:daily"
            [9] [string]:"chess:180+2:blitz"
            [10] [string]:"chess:300+1:blitz"
            [11] [string]:"chess:180+1:blitz"
            [12] [string]:"chess:60+1:bullet"
            [13] [string]:"chess:600:blitz"
            [14] [string]:"chess:300+2:blitz"
            [15] [string]:"chess:1800:rapid"
            [16] [string]:"chess:900:rapid"
            [17] [string]:"chess:300:blitz"
            [18] [string]:"chess:900+10:rapid"
            [19] [string]:"oddschess:180+3:blitz"
            [20] [string]:"oddschess:2700+15:rapid"
            [21] [string]:"oddschess:180:blitz"
            [22] [string]:"chess960:300+2:blitz"
            [23] [string]:"chess960:180+2:blitz"
            [24] [string]:"chess960:60+1:bullet"
            [25] [string]:"chess960:180:blitz"
            [26] [string]:"kingofthehill:180:blitz"
            [27] [string]:"threecheck:180:blitz"
            [28] [string]:"crazyhouse:180:blitz"
            [29] [string]:"bughouse:180:blitz"
            [30] [string]:"chess:900+2:rapid"
            [31] [string]:"chess:10:bullet"
            [32] [string]:"crazyhouse:1800:rapid"
            [33] [string]:"crazyhouse:60:bullet"
            [34] [string]:"oddschess:180+1:blitz"
            [35] [string]:"chess:120+1:bullet"
            [36] [string]:"oddschess:60+1:bullet"
            [37] [string]:"chess:600+2:blitz"
            [38] [string]:"chess:300+5:blitz"
            [39] [string]:"oddschess:600+5:blitz"
            [40] [string]:"chess:30:bullet"
            [41] [string]:"chess:600+2:rapid"
            [42] [string]:"chess:600+5:rapid"
            [43] [string]:"oddschess:300+10:rapid"
            [44] [string]:"chess960:2700:rapid"
            [45] [string]:"chess960:900+2:rapid"
            [46] [string]:"chess:120:bullet"
            [47] [string]:"oddschess:600:blitz"
            [48] [string]:"chess:1500+10:rapid"
            [49] [string]:"chess:600+3:rapid"
            [50] [string]:"chess:900+3:rapid"
            [51] [string]:"oddschess:300+2:blitz"
            [52] [string]:"oddschess:180+2:blitz"
            [53] [string]:"oddschess:120:bullet"
            [54] [string]:"oddschess:300:blitz"
            [55] [string]:"oddschess:240:blitz"
            [56] [string]:"oddschess:60:bullet"
            [57] [string]:"oddschess:600+5:rapid"
            [58] [string]:"oddschess:720:rapid"
            [59] [string]:"chess:3600+45:rapid"
            [60] [string]:"threecheck:60:bullet"
            [61] [string]:"chess:300+3:blitz"
            [62] [string]:"oddschess:900+10:rapid"
            [63] [string]:"chess:600+10:rapid"
            [64] [string]:"oddschess:480+2:blitz"
            [65] [string]:"chess:600:rapid"
            [66] [string]:"oddschess:600:rapid"
            [67] [string]:"chess:180+5:blitz"
            [68] [string]:"chess:480:blitz"
            [69] [string]:"chess:1200+10:rapid"
            [70] [string]:"oddschess:480:blitz"
            [71] [string]:"oddschess:420:blitz"
            */
            
        };

        private GameConfigurationStats gameConfigurationStats;

        private readonly DataContext _context;

        public ChessStatsService(IHttpClientFactory httpFactory, DataContext context) {
            _context = context;
            _client = httpFactory.CreateClient();

            gameConfigurationStats = new GameConfigurationStats(validGameConfigurations);
            // username = "test";
            // endpoint = baseUrl + username + content;
        }

        public async Task<ChessStats> GetStats(string username) {
            this.username = username;
            this.endpoint = baseUrl + username + content;

            // Console.WriteLine(this.username);
            // Console.WriteLine(this.endpoint);

            await RetrieveArchives(await GetMostRecentGameDate());

            ChessStats stats = new ChessStats {
                stats = gameConfigurationStats.AsJson()
            };

            // foreach (var kv in gameConfigurationStats.stats) {
            //     Console.WriteLine(kv.Key);

            //     foreach (var keyValue in gameConfigurationStats.stats[kv.Key]) {
            //         Console.WriteLine(keyValue.Value);
            //     }

            // }

            // return gameConfigurationStats.AsJson();

            return stats;
        }

        public async Task<IEnumerable<Game>> GetGames(string username) {
            this.username = username;
            this.endpoint = baseUrl + username + content;
            // TODO: Need to check when the last game for the user was parsed (which month)
            // Get the months of data that still need to be parsed and at the minimum the current month
            // Need error handling when attempt to parse a month of games where there were no games played
            // i.e. user played in 10/2020, but not in 11/2020, but then played in 12/2020. 11/2020 should through an error or return empty data?
            // Should be empty array of games if there were none


            lastPlayedGameEpoch = await GetMostRecentGameEpoch();
            // Parse any months of games that weren't parsed yet and update database
            await RetrieveArchives(await GetMostRecentGameDate());
            return await _context.Games.ToListAsync();
        }


        // Epoch time of most recent game played
        private async Task<int> GetMostRecentGameEpoch() {
            // Last played game time or 0 if no games exist
            var games = await _context.Games.Where(game => game.Username == username).ToListAsync();
            if (games.Count <= 0) {
                return 0;
            } else {
                return games.Max(game => game.EndTime);
            }
        }

        // Most recent game date with just year and month
        private async Task<DateTime> GetMostRecentGameDate() {
            int mostRecentGameTime =  await GetMostRecentGameEpoch();
            DateTimeOffset dateTimeOffset = DateTimeOffset.FromUnixTimeSeconds(mostRecentGameTime);
            DateTime mostRecentGameDate = new DateTime(dateTimeOffset.DateTime.Year, dateTimeOffset.DateTime.Month, 1);

            return mostRecentGameDate;
        }

        private async Task RetrieveArchives(DateTime mostRecentGameDate) {
            // Get the list of archives
            HttpResponseMessage chessArchives = await _client.GetAsync(this.endpoint, HttpCompletionOption.ResponseContentRead);

            // Read as string
            string chessArchivesString = await chessArchives.Content.ReadAsStringAsync();
            chessArchives.Dispose();

            // Deserialize so we can extract data from JSON
            JObject chessArchivesJson = JsonConvert.DeserializeObject<JObject>(chessArchivesString);

            JArray chessArchivesList = chessArchivesJson.Value<JArray>("archives");

            // TODO: Probably more efficient to parse backwards from the list of archives to so we don't needlessly hit endpoints we don't need to
            foreach (string archive in chessArchivesList) {
                string dateTime = archive.Split($"{baseUrl}{username}/games/")[1];
                DateTime archiveDate;
                DateTime.TryParseExact(dateTime, "yyyy/MM", CultureInfo.InvariantCulture, DateTimeStyles.None, out archiveDate);

                Console.WriteLine($"Current archive date: {archiveDate}");

                // Only parse archives if we haven't parsed it yet, or it's the most recently played month (user may have played more games in that month since last parsed)
                if (archiveDate >= mostRecentGameDate) {
                    await RetrieveArchive(archive);
                }
            }
        }


        // Gets game stats given archives of games (from https://api.chess.com/pub/player/{username}/games/archives)
        private async Task RetrieveArchive(string archive) {
            // Get the games from a single archive
            HttpResponseMessage chessArchive = await _client.GetAsync(archive, HttpCompletionOption.ResponseContentRead);

            // Read as string
            string chessArchiveString = await chessArchive.Content.ReadAsStringAsync();
            chessArchive.Dispose();

            // Deserialize so we can extract data from JSON
            JObject chessArchiveJson = JsonConvert.DeserializeObject<JObject>(chessArchiveString);

            await ParseGameArchive(chessArchiveJson.Value<JArray>("games"));
        }

        // All the games from a single archive (normally within a 1 month period)
        // TODO: Find a way to separate the results from each type of game played (rapid, etc)
        private async Task ParseGameArchive(JArray gamesFromSingleArchive) {
            foreach (var game in gamesFromSingleArchive) {

                int endTime = game.Value<int>("end_time");
                // TODO: Loop backwards from gamesFromSingleArchive to avoid needlessly parsing games we don't need to
                //      Once the endtime is less than or equal to lastPlayedGameEpoch, we can break and stop processing any more games
                if (endTime <= lastPlayedGameEpoch) {
                    continue;
                }
                string rules = game.Value<string>("rules");
                string timeControl = game.Value<string>("time_control");
                string timeClass = game.Value<string>("time_class");

                string configuration = $"{rules}:{timeControl}:{timeClass}";

                if (!validGameConfigurations.Contains(configuration)) {
                    continue;
                }

                // Determine outcome
                JObject white = game.Value<JObject>("white");
                JObject black = game.Value<JObject>("black");

                // Determine if we were white or black
                bool currentPlayerIsWhite = white.Value<string>("username").ToLower().Equals(username.ToLower());
                JObject currentPlayer = currentPlayerIsWhite ? white : black;
                JObject otherPlayer = currentPlayerIsWhite ? black : white;





                string result = "";
                // TODO: The pgn contains a lot of useful data and this switch statement become invalidated really..
                switch (currentPlayer.Value<string>("result")) {
                    // Game was a draw, no one won
                    case GameResult.DrawByAgreement:
                        result = nameof(GameResultType.DrawByAgreement);

                        // gameConfigurationStats.stats[configuration][GameResultType.DrawByAgreement]++;
                        break;
                    case GameResult.DrawByRepitition:
                        result = nameof(GameResultType.DrawByRepitition);

                        // gameConfigurationStats.stats[configuration][GameResultType.DrawByRepitition]++;
                        break;
                    case GameResult.DrawByStalemate:
                        result = nameof(GameResultType.DrawByStalemate);

                        // gameConfigurationStats.stats[configuration][GameResultType.DrawByStalemate]++;
                        break;
                    case GameResult.DrawByInsufficientMaterial:
                        result = nameof(GameResultType.DrawByInsufficientMaterial);

                        // gameConfigurationStats.stats[configuration][GameResultType.DrawByInsufficientMaterial]++;
                        break;
                    case GameResult.DrawByTimeoutVsInsufficientMaterial:
                        result = nameof(GameResultType.DrawByTimeoutVsInsufficientMaterial);

                        // gameConfigurationStats.stats[configuration][GameResultType.DrawByTimeoutVsInsufficientMaterial]++;
                        break;
                    case GameResult.DrawBy50Move:
                        result = nameof(GameResultType.DrawBy50Move);

                        // gameConfigurationStats.stats[configuration][GameResultType.DrawBy50Move]++;
                        break;
                    // We won
                    case GameResult.Win:
                        switch (otherPlayer.Value<string>("result")) {
                            case GameResult.CheckMated:
                                result = nameof(GameResultType.WonByCheckmate);

                                // gameConfigurationStats.stats[configuration][GameResultType.WonByCheckmate]++;
                                break;
                            case GameResult.Resigned:
                                result = nameof(GameResultType.WonByResignation);

                                // gameConfigurationStats.stats[configuration][GameResultType.WonByResignation]++;
                                break;
                            case GameResult.Abandonded:
                                result = nameof(GameResultType.WonByAbandonment);

                                // gameConfigurationStats.stats[configuration][GameResultType.WonByAbandonment]++;
                                break;
                            case GameResult.Timeout:
                                result = nameof(GameResultType.WonOnTime);

                                // gameConfigurationStats.stats[configuration][GameResultType.WonOnTime]++;
                                break;
                        }
                        break;
                    // Otherwise we lost
                    case GameResult.CheckMated:
                        result = nameof(GameResultType.LostByCheckmate);

                        // gameConfigurationStats.stats[configuration][GameResultType.LostByCheckmate]++;
                        break;
                    case GameResult.Resigned:
                        result = nameof(GameResultType.LostByResignation);

                        // gameConfigurationStats.stats[configuration][GameResultType.LostByResignation]++;
                        break;
                    case GameResult.Abandonded:
                        result = nameof(GameResultType.LostByAbandonment);

                        // gameConfigurationStats.stats[configuration][GameResultType.LostByAbandonment]++;
                        break;
                    case GameResult.Timeout:
                        result = nameof(GameResultType.LostOnTime);

                        // gameConfigurationStats.stats[configuration][GameResultType.LostOnTime]++;
                        break;
                }


                // TODO: There is more useful information within the pgn like opening played etc
                _context.Games.Add(new Game{
                    Username = username.ToLower(),
                    Rules = rules,
                    TimeControl = timeControl,
                    TimeClass = timeClass,
                    Result = result,
                    Opponent = currentPlayerIsWhite ? black.Value<string>("username").ToLower() : white.Value<string>("username").ToLower(),
                    Rated = game.Value<bool>("rated"),
                    Pgn = game.Value<string>("pgn"),
                    Fen = game.Value<string>("fen"),
                    EndTime = endTime
                });

                await _context.SaveChangesAsync();
            }

        }
    }
}