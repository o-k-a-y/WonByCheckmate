import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-wld-pie-charts',
  templateUrl: './wld-pie-charts.component.html',
  styleUrls: ['./wld-pie-charts.component.scss']
})
export class WldPieChartsComponent implements OnInit {
  @Input() data: {};
  @Input() gameConfig: string;

  @Input() wonLabels: string[] = [];
  @Input() lostLabels: string[] = [];
  @Input() drawLabels: string[] = [];
  
  wldLabels: string[] = ['Won', 'Lost', 'Draw'];

  wonData: {} = {};
  lostData: {} = {};
  drawData: {} = {};
  wldData: {} = {};

  shouldShowDetailedCharts: boolean;
  
  constructor() { }

  ngOnInit(): void {
    let wonGames = 0;
    let lostGames = 0;
    let drawGames = 0;

    for (const key in this.data) {
      if (key.includes('Won')) {
        this.wonData[key] = this.data[key];
        wonGames += this.data[key];
      } else if (key.includes('Lost')) {
        this.lostData[key] = this.data[key];
        lostGames += this.data[key];
      } else if (key.includes('Draw')) {
        this.drawData[key] = this.data[key];
        drawGames += this.data[key];
      }
    }

    this.wldData['Won'] = wonGames;
    this.wldData['Lost'] = lostGames;
    this.wldData['Draw'] = drawGames; 
  }

  toggleShowDetailedCharts() {
    this.shouldShowDetailedCharts = !this.shouldShowDetailedCharts;
  }
}
