import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChessStats } from '../models/chess-stats.model';

@Component({
  selector: 'app-stats-graphs',
  templateUrl: './stats-graphs.component.html',
  styleUrls: ['./stats-graphs.component.scss']
})
export class StatsGraphsComponent implements AfterViewInit {
  @Output() rendered: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() stats: ChessStats
  
  displayTables: boolean = true;
  
  ngAfterViewInit(): void {
    this.rendered.emit(true);
  }

  toggleCharts() {
    this.displayTables = !this.displayTables;
  }
}
