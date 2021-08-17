import { Component, ElementRef, SimpleChange, ViewChild } from '@angular/core';
import { ChessStats } from './models/chess-stats.model';
import { NetworkError } from './models/network-error-enum';
import { UsernameRequest } from './models/username-request.model';
import { LoaderService } from './loader/loader.service';
import { PlayerStatsService } from './services/player-stats.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('statsGraphs') statsGraphs: ElementRef;
  title = 'WonByCheckmate';

  httpError: NetworkError = NetworkError.None;
  doneParsing: boolean = false;
  stats!: ChessStats;

  constructor(public playerStatsService: PlayerStatsService,
              public loaderService: LoaderService) {}

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChange) {
    console.log(changes);
    console.log('changes');
  }


  fetchPlayerStats(request: UsernameRequest) {
    this.httpError = NetworkError.None;
    this.doneParsing = false;

    // console.log(username);

    this.playerStatsService.getStats(request).subscribe(
      (stats: ChessStats) => {
        // console.log(stats);
        this.stats = stats;
        this.doneParsing = true;
      },
      (error) => {
        // TODO: Handles all the types of errors
        this.httpError = NetworkError.GenericError;
        console.log(error);
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
