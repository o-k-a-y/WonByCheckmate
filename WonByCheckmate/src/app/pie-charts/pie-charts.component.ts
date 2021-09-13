import { Component, Input, OnInit } from '@angular/core';
import { ChessStats } from '../models/chess-stats.model';
import { ConfigService } from '../services/config-service';

@Component({
  selector: 'app-pie-charts',
  templateUrl: './pie-charts.component.html',
  styleUrls: ['./pie-charts.component.scss']
})
export class PieChartsComponent implements OnInit {
  @Input() data!: ChessStats;

  timeClasses: string[] = [];

  pieChartData: {} = {};

  constructor(public configService: ConfigService) { }

  ngOnInit(): void {
    // Filter out time class data where there is no data for that time class
    this.timeClasses = Object.keys(this.data).filter(timeClass => {
      return Object.keys(this.data[timeClass]).length !== 0;
    });
    // console.log(this.data);
  }
}
