import { Component, ElementRef, SimpleChange, ViewChild } from '@angular/core';
import { ChessStats } from './models/chess-stats.model';
import { PlayerStatsService } from './services/player-stats.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('statsGraphs') statsGraphs: ElementRef;
  title = 'WonByCheckmate';

  httpError: boolean = false;
  doneParsing: boolean = false;
  stats!: ChessStats;

  constructor(public playerStatsService: PlayerStatsService) {}

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChange) {
    console.log(changes);
    console.log('changes');
  }


  fetchPlayerStats(username: string) {
    this.httpError = false;
    this.doneParsing = false;

    // console.log(username);

    this.playerStatsService.getStats(username).subscribe(
      (stats: ChessStats) => {
        // console.log(stats);
        this.stats = stats;
        this.doneParsing = true;
      },
      (error) => {
        console.log(error);
        this.httpError = true;
      },
      () => {
      }
    );
  }

  // Smoothly scroll to the graphs built from the stats data
  scrollToView() {
    this.statsGraphs.nativeElement.scrollIntoView({behavior: 'smooth'});
  }

}
