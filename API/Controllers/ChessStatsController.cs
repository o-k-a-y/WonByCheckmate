using System;
using System.Net.Http;
using System.Threading.Tasks;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace API.Controllers {
    public class ChessStatsController : BaseApiController {
        private readonly IChessStatsService _chessStatsService;

        public ChessStatsController(IChessStatsService chessStatsService) {
            _chessStatsService = chessStatsService;
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<JObject>> GetStats(string username) {
            return Ok(await _chessStatsService.GetStats(username));
        }
    }
}