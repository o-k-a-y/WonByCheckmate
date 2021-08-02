using API.Services;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;

// Validates game configurations
namespace API.Middleware {
    public class GameConfigsMiddleware {
        private readonly RequestDelegate _next;

        public GameConfigsMiddleware(RequestDelegate next) {
            _next = next;
        }
        public async Task InvokeAsync(HttpContext context, IChessStatsService svc) {
            
            List<string> gameConfigs = new List<string>(context.Request.Query["config"].ToArray());
            if (gameConfigs != null) {
                foreach (string gameConfig in gameConfigs) {
                    Console.WriteLine(gameConfig);
                }
            }

            // Call the next delegate/middleware in the pipeline
            await _next(context);
        }
    }
}