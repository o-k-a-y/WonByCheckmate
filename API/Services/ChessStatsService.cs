using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using API.Models;
using Newtonsoft.Json; // JsonConvert
using Newtonsoft.Json.Linq; // JObject, JArray

namespace API.Services {
    public class ChessStatsService : IChessStatsService {
        HttpClient _client;
        private const string baseUrl = "https://api.chess.com/pub/player/";
        private const string content = "/games/archives";
        private string username;
        private string endpoint;

        private DateTime time;
        private int milliseconds = 0;


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
            // "chess:180+1:blitz",
            // "chess:180+2:blitz",
            // "chess:180+5:blitz",
            // "chess:300+1:blitz",
            // "chess:300+2:blitz",
            // "chess:300+3:blitz",
            // "chess:300+5:blitz",
            // "chess:600+2:blitz",
            
            // Rapid
            "chess:600:rapid", // 10 minute game
            "chess:900:rapid", // 15 minute
            "chess:1200:rapid", // 20 minute
            "chess:1800:rapid", // 30 minute
            "chess:3600:rapid", // 1 hour
            // "chess:600+2:rapid",
            // "chess:600+5:rapid",
            // "chess:600+3:rapid",
            // "chess:600+10:rapid",
            // "chess:600+15:rapid",
            // "chess:900+2:rapid",
            // "chess:900+3:rapid",
            // "chess:900+10:rapid",
            // "chess:1200+10:rapid",
            // "chess:1500+10:rapid",
            // "chess:2700+45:rapid", // 45 minutes + 45 seconds per move
            // "chess:3600+45:rapid",

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


        public ChessStatsService(IHttpClientFactory httpFactory) {
            time = DateTime.Now;
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

            await RetrieveArchives();

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

        private async Task RetrieveArchives() {
            // Get the list of archives
            HttpResponseMessage chessArchives = await _client.GetAsync(this.endpoint, HttpCompletionOption.ResponseContentRead);

            // Read as string
            string chessArchivesString = await chessArchives.Content.ReadAsStringAsync();
            chessArchives.Dispose();

            // Deserialize so we can extract data from JSON
            JObject chessArchivesJson = JsonConvert.DeserializeObject<JObject>(chessArchivesString);

            JArray chessArchivesList = chessArchivesJson.Value<JArray>("archives");

            foreach (string archive in chessArchivesList) {
                await RetrieveArchive(archive);
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

            ParseGameArchive(chessArchiveJson.Value<JArray>("games"));
        }

        // All the games from a single archive (normally within a 1 month period)
        // TODO: Find a way to separate the results from each type of game played (rapid, etc)
        private void ParseGameArchive(JArray gamesFromSingleArchive) {
            DateTime time = DateTime.Now;

            // Debug.WriteLine("test");
            foreach (var game in gamesFromSingleArchive) {
                
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


                switch (currentPlayer.Value<string>("result")) {
                    // Game was a draw, no one won
                    case GameResult.DrawByAgreement:
                        gameConfigurationStats.stats[configuration][GameResultType.DrawByAgreement]++;
                        break;
                    case GameResult.DrawByRepitition:
                        gameConfigurationStats.stats[configuration][GameResultType.DrawByRepitition]++;
                        break;
                    case GameResult.DrawByStalemate:
                        gameConfigurationStats.stats[configuration][GameResultType.DrawByStalemate]++;
                        break;
                    case GameResult.DrawByInsufficientMaterial:
                        gameConfigurationStats.stats[configuration][GameResultType.DrawByInsufficientMaterial]++;
                        break;
                    case GameResult.DrawByTimeoutVsInsufficientMaterial:
                        gameConfigurationStats.stats[configuration][GameResultType.DrawByTimeoutVsInsufficientMaterial]++;
                        break;
                    case GameResult.DrawBy50Move:
                        gameConfigurationStats.stats[configuration][GameResultType.DrawBy50Move]++;
                        break;
                    // We won
                    case GameResult.Win:
                        switch (otherPlayer.Value<string>("result")) {
                            case GameResult.CheckMated:
                                gameConfigurationStats.stats[configuration][GameResultType.WonByCheckmate]++;
                                break;
                            case GameResult.Resigned:
                                gameConfigurationStats.stats[configuration][GameResultType.WonByResignation]++;
                                break;
                            case GameResult.Abandonded:
                                gameConfigurationStats.stats[configuration][GameResultType.WonByAbandonment]++;
                                break;
                            case GameResult.Timeout:
                                gameConfigurationStats.stats[configuration][GameResultType.WonOnTime]++;
                                break;
                        }
                        break;
                    // Otherwise we lost
                    case GameResult.CheckMated:
                        gameConfigurationStats.stats[configuration][GameResultType.LostByCheckmate]++;
                        break;
                    case GameResult.Resigned:
                        gameConfigurationStats.stats[configuration][GameResultType.LostByResignation]++;
                        break;
                    case GameResult.Abandonded:
                        gameConfigurationStats.stats[configuration][GameResultType.LostByAbandonment]++;
                        break;
                    case GameResult.Timeout:
                        gameConfigurationStats.stats[configuration][GameResultType.LostOnTime]++;
                        break;
                }
            }

            milliseconds += DateTime.Now.Millisecond - time.Millisecond;
            Console.WriteLine(milliseconds);
        }
    }
}