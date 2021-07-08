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
        private readonly DataContext _context;

        public ChessStatsController(DataContext context, IChessStatsService chessStatsService) {
            _context = context;
            _chessStatsService = chessStatsService;
        }

        [HttpGet("games/{username}")]
        public async Task<ActionResult<IEnumerable<Game>>> GetGames(string username) {
            return Ok(await _chessStatsService.GetGames(username));
            // return Ok(await _context.Games.ToListAsync());
        }
        [HttpGet("{username}")]
        public async Task<ActionResult<ChessStats>> GetStats(string username) {
            return Ok(await _chessStatsService.GetStats(username));
        }

    }
}