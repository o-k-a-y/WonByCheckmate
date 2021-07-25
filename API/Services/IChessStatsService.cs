using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using API.Entities;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace API.Services {
    public interface IChessStatsService {
        // TODO: Switch back to ChessStats if possible to have nested objects accessed like dictionary (implement IDictionary)
        Task<Dictionary<string, Dictionary<string, Dictionary<string, int>>>> GetStats(string username);
        // Task<ChessStats> GetStats(string username);
        Task<IEnumerable<Game>> GetGames(string username);
    }
}