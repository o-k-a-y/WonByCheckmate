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
using API.Extensions;
using System.Diagnostics;

namespace API.Services {
    public class ChessStatsService : IChessStatsService {
        private readonly DataContext _context;
        private HttpClient _client;
        private const string baseUrl = "https://api.chess.com/pub/player/";
        private const string archives = "/games/archives";
        private string endpoint;

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
            "chess:480:blitz", // this one isn't very common, remove maybe
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


        public ChessStatsService(IHttpClientFactory httpFactory, DataContext context) {
            _context = context;
            _client = httpFactory.CreateClient();
        }

        public async Task<ChessStats> GetStats(string username) {
            await UpdateGamesIfNeeded(username);

            return await BuildStatsFromDatabase(username);
        }


        // Returns all the games a user has played
        public async Task<IEnumerable<Game>> GetGames(string username) {
            await UpdateGamesIfNeeded(username);

            return await _context.Games.ToListAsync();
        }

        private async Task UpdateGamesIfNeeded(string username) {
            // Stopwatch stopWatch = new Stopwatch();
            // stopWatch.Start();

            this.endpoint = baseUrl + username + archives;

            // Get the months of data that still need to be parsed and at the minimum the current month
            // Endpoint should be empty array of games if there is a month where there were no games played
            // i.e. user played in 10/2020, but not in 11/2020, but then played in 12/2020. 11/2020 should through an empty array
            // We avoid this by only fetching endpoint data where games are returned because that's what https://api.chess.com/pub/player/{username}/games/archives" returns

            // The last played game a user played that is stored in the database
            int lastPlayedGameEpoch = await GetMostRecentGameEpoch(username);
            // Parse any months of games that weren't parsed yet and update database
            await RetrieveArchives(username, lastPlayedGameEpoch);
            await _context.SaveChangesAsync();

            // stopWatch.Stop();
            // // Get the elapsed time as a TimeSpan value.
            // TimeSpan ts = stopWatch.Elapsed;

            // // Format and display the TimeSpan value.
            // string elapsedTime = String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
            //     ts.Hours, ts.Minutes, ts.Seconds,
            //     ts.Milliseconds / 10);
            // Console.WriteLine("RunTime " + elapsedTime);
        }


        // TODO: Once tables are separated with User table that contains Game table reference, modify LINQ queries to return updated structure according to schema
        // TODO: The LINQ queries used are probably not efficient at all
        private async Task<ChessStats> BuildStatsFromDatabase(string username) {

            ChessStats stats = new ChessStats();
            stats.stats = new JObject();
            foreach (string config in validGameConfigurations) {
                // chess:30:bullet
                List<string> c = new List<string>(config.Split(':'));
                string timeClass = c[2];
                string timeControl = c[1];
                string rules = c[0];
                var resultTypes = Enum.GetNames(typeof(GameResultType));
                stats.stats[config] = new JObject();
                // int count = 0;
                foreach (var result in resultTypes) {
                    // count += await _context.Games.Where(game => game.Username == this.username && game.Result == result && game.TimeClass == timeClass && game.TimeControl == timeControl && game.Rules == rules).CountAsync();
                    stats.stats[config][result] = await _context.Games.Where(game => game.Username == username && game.Result == result && game.TimeClass == timeClass && game.TimeControl == timeControl && game.Rules == rules).CountAsync();
                }
                // Console.WriteLine($"Count for {config} = {count}");
            }

            return stats;
        }

        // Epoch time of most recent game played
        private async Task<int> GetMostRecentGameEpoch(string username) {
            // Last played game time or 0 if no games exist
            var games = await _context.Games.Where(game => game.Username == username).ToListAsync();
            if (games.Count <= 0) {
                return 0;
            } else {
                return games.Max(game => game.EndTime);
            }
        }

        // Most recent game date with just year and month
        // 05/2021
        private DateTime GetMostRecentGameDate(int epochDate) {
            // int mostRecentGameTime = await GetMostRecentGameEpoch();
            DateTimeOffset dateTimeOffset = DateTimeOffset.FromUnixTimeSeconds(epochDate);
            DateTime mostRecentGameDate = new DateTime(dateTimeOffset.DateTime.Year, dateTimeOffset.DateTime.Month, 1);

            return mostRecentGameDate;
        }

        private async Task RetrieveArchives(string username, int lastPlayedGameEpoch) {
            DateTime mostRecentGameDate = GetMostRecentGameDate(lastPlayedGameEpoch);

            // Get the list of archives
            HttpResponseMessage chessArchives = await _client.GetAsync(this.endpoint, HttpCompletionOption.ResponseContentRead);

            // Read as string
            string chessArchivesString = await chessArchives.Content.ReadAsStringAsync();
            chessArchives.Dispose();

            // Deserialize so we can extract data from JSON
            JObject chessArchivesJson = JsonConvert.DeserializeObject<JObject>(chessArchivesString);

            JArray chessArchivesList = chessArchivesJson.Value<JArray>("archives");

            // The below comment might be misleading because if the games aren't all entirely parsed, there will be issues, don't do it
            // More efficient to parse backwards from the list of archives to so we don't needlessly hit endpoints we don't need to
            foreach (string archive in chessArchivesList.FastReverse()) {
                // foreach (string archive in chessArchivesList) {
                string dateTime = archive.Split($"{baseUrl}{username}/games/")[1];
                DateTime archiveDate;
                DateTime.TryParseExact(dateTime, "yyyy/MM", CultureInfo.InvariantCulture, DateTimeStyles.None, out archiveDate);

                Console.WriteLine($"Current archive date: {archiveDate}");

                // TODO: Maybe can add a break statement to exit if the game isn't >= the most recent game date, but make sure that the order is guaranteed
                // Only parse archives if we haven't parsed it yet, or it's the most recently played month (user may have played more games in that month since last parsed)
                if (archiveDate >= mostRecentGameDate) {
                    await RetrieveArchive(archive, username, lastPlayedGameEpoch);
                }
            }
        }


        // Gets game stats given archives of games (from https://api.chess.com/pub/player/{username}/games/archives)
        private async Task RetrieveArchive(string archive, string username, int lastPlayedGameEpoch) {
            // Get the games from a single archive
            HttpResponseMessage chessArchive = await _client.GetAsync(archive, HttpCompletionOption.ResponseContentRead);

            // Read as string
            string chessArchiveString = await chessArchive.Content.ReadAsStringAsync();
            chessArchive.Dispose();

            // Deserialize so we can extract data from JSON
            JObject chessArchiveJson = JsonConvert.DeserializeObject<JObject>(chessArchiveString);

            await ParseGameArchive(chessArchiveJson.Value<JArray>("games"), username, lastPlayedGameEpoch);
        }

        // Parse all the games from a single archive (games in a single month)
        private async Task ParseGameArchive(JArray gamesFromSingleArchive, string username, int lastPlayedGameEpoch) {
            // Loop backwards from gamesFromSingleArchive to avoid needlessly parsing games we don't need to
            foreach (var game in gamesFromSingleArchive.FastReverse()) {
                int endTime = game.Value<int>("end_time");
                // TODO: Once the endtime is less than or equal to lastPlayedGameEpoch, we can break and stop processing any more games assuming order is guaranteed
                if (endTime <= lastPlayedGameEpoch) {
                    continue;
                }
                string rules = game.Value<string>("rules");
                string timeControl = game.Value<string>("time_control");
                string timeClass = game.Value<string>("time_class");

                string configuration = $"{rules}:{timeControl}:{timeClass}";

                // Only check valid game configurations
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
                        break;
                    case GameResult.DrawByRepetition:
                        result = nameof(GameResultType.DrawByRepetition);
                        break;
                    case GameResult.DrawByStalemate:
                        result = nameof(GameResultType.DrawByStalemate);
                        break;
                    case GameResult.DrawByInsufficientMaterial:
                        result = nameof(GameResultType.DrawByInsufficientMaterial);
                        break;
                    case GameResult.DrawByTimeoutVsInsufficientMaterial:
                        result = nameof(GameResultType.DrawByTimeoutVsInsufficientMaterial);
                        break;
                    case GameResult.DrawBy50Move:
                        result = nameof(GameResultType.DrawBy50Move);
                        break;
                    // We won
                    case GameResult.Win:
                        switch (otherPlayer.Value<string>("result")) {
                            case GameResult.CheckMated:
                                result = nameof(GameResultType.WonByCheckmate);
                                break;
                            case GameResult.Resigned:
                                result = nameof(GameResultType.WonByResignation);
                                break;
                            case GameResult.Abandoned:
                                result = nameof(GameResultType.WonByAbandonment);
                                break;
                            case GameResult.Timeout:
                                result = nameof(GameResultType.WonByTimeout);
                                break;
                        }
                        break;
                    // Otherwise we lost
                    case GameResult.CheckMated:
                        result = nameof(GameResultType.LostByCheckmate);
                        break;
                    case GameResult.Resigned:
                        result = nameof(GameResultType.LostByResignation);
                        break;
                    case GameResult.Abandoned:
                        result = nameof(GameResultType.LostByAbandonment);
                        break;
                    case GameResult.Timeout:
                        result = nameof(GameResultType.LostByTimeout);
                        break;
                }

                // TODO: There is more useful information within the pgn like opening played etc
                _context.Games.Add(new Game {
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
            }
            // await _context.SaveChangesAsync();
        }
    }
}