using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using API.Entities;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace API.Services {
    public interface IChessStatsService {
        Task<ChessStats> GetStats(string username);
        Task<IEnumerable<Game>> GetGames(string username);
    }
}