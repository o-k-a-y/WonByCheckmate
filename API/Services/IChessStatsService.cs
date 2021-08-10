using System.Collections.Generic;
using System.Threading.Tasks;
using API.Entities;
using API.Models;

namespace API.Services {
    public interface IChessStatsService {
        Task<ChessStats> GetStats(string username, IList<Config> configs);
        // Task<ChessStats> GetStats(string username);
        Task<IEnumerable<Game>> GetGames(string username);
    }
}