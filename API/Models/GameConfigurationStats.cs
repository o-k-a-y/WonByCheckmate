using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace API.Models
{
    // All configurations we care about and the associated game stats from that configuration
    // Example configuration: rules are chess, time control is 600 seconds, and time class is rapid
    public class GameConfigurationStats
    {
        // private Dictionary<GameResultType, int> stats;

        public Dictionary<string, Dictionary<GameResultType, int>> stats {get; set;}

        public GameConfigurationStats(HashSet<string> configurations) {
            stats = new Dictionary<string, Dictionary<GameResultType, int>>();
            foreach (string config in configurations) {
                stats.Add(config, GameConfigurationDictionary());
            }
        }

        // TODO
        public JObject AsJson() {
            // Convert each key's value (each game configuration) to a dictionary
            // Then create a list of json inside a json object to return
            string json = JsonConvert.SerializeObject(stats, Formatting.Indented);
            // string json = stats.ToString();
            return JObject.Parse(json);

        }

        // Stats of a single game configuration
        private Dictionary<GameResultType, int> GameConfigurationDictionary() {
            Dictionary<GameResultType, int> gameStats = new Dictionary<GameResultType, int>();
            gameStats[GameResultType.WonByResignation] = 0;
            gameStats[GameResultType.WonByTimeout] = 0;
            gameStats[GameResultType.WonByCheckmate] = 0;
            gameStats[GameResultType.WonByAbandonment] = 0;
            gameStats[GameResultType.DrawByAgreement] = 0;
            gameStats[GameResultType.DrawByStalemate] = 0;
            gameStats[GameResultType.DrawByRepetition] = 0;
            gameStats[GameResultType.DrawByInsufficientMaterial] = 0;
            gameStats[GameResultType.DrawByTimeoutVsInsufficientMaterial] = 0;
            gameStats[GameResultType.DrawBy50Move] = 0;
            gameStats[GameResultType.LostByResignation] = 0;
            gameStats[GameResultType.LostByTimeout] = 0;
            gameStats[GameResultType.LostByCheckmate] = 0;
            gameStats[GameResultType.LostByAbandonment] = 0;

            return gameStats;
        }


    }
}