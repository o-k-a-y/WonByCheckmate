using System.Text.Json.Serialization;
using Newtonsoft.Json.Linq;

namespace API.Models {
    // Convert this type to JSON so API can correctly return data
    // https://stackoverflow.com/questions/20995865/deserializing-json-to-abstract-class
    [JsonConverter(typeof(JObject))]
    public class ChessStats {
        public JObject stats { get; set; }
        public ChessStats() {}
    }
}