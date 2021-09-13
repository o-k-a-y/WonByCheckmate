import { Component, ElementRef, OnChanges, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { LoaderService } from '../loader/loader.service';
import { ChessStats } from '../models/chess-stats.model';
import { NetworkError } from '../models/network-error-enum';
import { UsernameRequest } from '../models/username-request.model';
import { PlayerStatsService } from '../services/player-stats.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  @ViewChild('statsGraphs') statsGraphs: ElementRef;

  httpError: NetworkError = NetworkError.None;
  doneParsing: boolean = false;
  stats!: ChessStats;

  constructor(public playerStatsService: PlayerStatsService,
    public loaderService: LoaderService) { }

  ngOnInit(): void {
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
    // TODO: Subtract the height of the navbar so the view is just before the element we're scrolling to
    // The navbar covers the element enough to be an inconvenience if the page is long enough
    this.statsGraphs.nativeElement.scrollIntoView({behavior: 'smooth'});
  }

}
