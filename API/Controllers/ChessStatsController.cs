using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers {
    public class ChessStatsController : BaseApiController {
        private readonly IChessStatsService _chessStatsService;

        public ChessStatsController(DataContext context, IChessStatsService chessStatsService) {
            _chessStatsService = chessStatsService;
        }

        [HttpGet("games/{username}")]
        public async Task<ActionResult<IEnumerable<Game>>> GetGames(string username) {
            // TODO: Some http interceptor to take care of casting username to lower case?
            return Ok(await _chessStatsService.GetGames(username.ToLower()));
        }

        // [FromQuery(Name = "config")] allows passing multiple query parameters with the same key
        // The parameter is renamed to config so something like ?config=1&config=2&config=3 is possible
        [HttpGet("{username}")]
        public async Task<ActionResult<ChessStats>> GetStats(string username, [FromQuery(Name = "config")] List<string> configs = null) {
            Console.WriteLine(configs);
            return Ok(await _chessStatsService.GetStats(username.ToLower()));
        }

    }
}