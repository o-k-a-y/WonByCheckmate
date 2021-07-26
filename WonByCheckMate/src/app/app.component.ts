import { Component } from '@angular/core';
import { PlayerStatsService } from './services/player-stats.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'WonByCheckmate';

  httpError: boolean;
  doneParsing: boolean;
  stats: {};

  displayTables: boolean = true;

  constructor(public playerStatsService: PlayerStatsService) {
    
  }

  ngOnInit() {
  }


  fetchPlayerStats(username: string) {
    this.httpError = false;
    this.doneParsing = false;

    console.log(username);

    this.playerStatsService.getStats(username).subscribe(
      (stats: {}) => {
        console.log(stats);
        this.stats = stats;
        this.doneParsing = true;
      },
      error => {
        console.log(error);
        this.httpError = true;
      }
    );
  }

  toggleCharts() {
    this.displayTables = !this.displayTables;
  }
  
}
