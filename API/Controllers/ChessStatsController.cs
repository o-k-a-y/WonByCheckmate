using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;

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
        [HttpGet("{username}")]
        public async Task<ActionResult<ChessStats>> GetStats(string username) {
            return Ok(await _chessStatsService.GetStats(username.ToLower()));
        }

    }
}