using System.Net.Http;
using System.Threading.Tasks;
using API.Models;
using Newtonsoft.Json.Linq;

namespace API.Services {
    public interface IChessStatsService {
        Task<ChessStats> GetStats(string username);
    }
}