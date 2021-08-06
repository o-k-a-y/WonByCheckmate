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
        public async Task<ActionResult<ChessStats>> GetStats(string username, string configs) {
            ValidGameConfigurations validGameConfigurations = new ValidGameConfigurations();
            if (configs != null) {
                string[] configArr = configs.Split(',');
                Console.WriteLine(configArr);
                foreach (string config in configArr) {
                    string[] configParts = config.Split(':');
                    if (configParts.Length != 3) {
                        return NotFound();
                    }

                    // TODO: create some TryParse method on Config to see if the object was created successfully
                    if (!validGameConfigurations.Contains(new Config(configParts[0], configParts[1], configParts[2]))) {
                        return NotFound();
                    }
                    Console.WriteLine(config);
                }
            }
            return Ok(await _chessStatsService.GetStats(username.ToLower()));
        }

    }
}