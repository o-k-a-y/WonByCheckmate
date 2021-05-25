import { Component } from '@angular/core';
import { PlayerStatsService } from './services/player-stats.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SusChessPlayers';

  httpError: boolean;
  doneParsing: boolean;
  stats: JSON;
  configurations;


  constructor(public playerStatsService: PlayerStatsService) {
    
  }

  ngOnInit() {
  }


  fetchPlayerStats(username: string) {
    this.httpError = false;
    this.doneParsing = false;

    console.log(username);

    this.playerStatsService.getStats(username).subscribe(
      (stats: JSON) => {
        this.stats = stats;
        this.doneParsing = true;
        this.configurations = Object.keys(stats['stats']);
      },
      error => {
        console.log(error);
        this.httpError = true;
      }
    );
  }
  
}
