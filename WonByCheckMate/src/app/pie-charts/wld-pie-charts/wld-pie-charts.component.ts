import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/config-service';

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

  // TODO: move to some service that handles timeClass, timeControl, etc to inject where needed
  // private timeClass: {} = {
  //   "bullet": "🚀",
  //   "blitz": "⚡",
  //   "rapid": "⏲️",
  //   "daily": "🗓️"
  // }
  
  won = 'Won';
  lost = 'Lost';
  draw = 'Draw';
  wldLabels: string[] = [this.won, this.lost, this.draw];

  wonData: {} = {};
  lostData: {} = {};
  drawData: {} = {};
  wldData: {} = {};

  shouldShowDetailedCharts: boolean;
  
  constructor(private configService: ConfigService) { }

  ngOnInit(): void {
    let wonGames = 0;
    let lostGames = 0;
    let drawGames = 0;

    // Build the data for the pie charts for won/lost/draw
    for (const key in this.data) {
      if (key.includes(this.won.toLowerCase())) {
        this.wonData[key] = this.data[key];
        wonGames += this.data[key];
      } else if (key.includes(this.lost.toLowerCase())) {
        this.lostData[key] = this.data[key];
        lostGames += this.data[key];
      } else if (key.includes(this.draw.toLowerCase())) {
        this.drawData[key] = this.data[key];
        drawGames += this.data[key];
      }
    }

    this.wldData[this.won] = wonGames;
    this.wldData[this.lost] = lostGames;
    this.wldData[this.draw] = drawGames; 
  }

  toggleShowDetailedCharts() {
    this.shouldShowDetailedCharts = !this.shouldShowDetailedCharts;
  }

  // TODO: Properly convert titles
  // convertTitle(gameConfig: string): string {
  //   console.log(gameConfig);
  //   const gameConfigArr = gameConfig.split(':');
  //   const timeControl = this.convertTimeControl(gameConfigArr[1]);
  //   const timeClass = this.convertTimeClass(gameConfigArr[2]);

  //   return `${timeClass} ${timeControl}`;
  // }



  

}
