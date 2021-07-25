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

  // TODO: move to some service that handles timeClass, timeControl, etc to inject where needed
  private timeClass: {} = {
    "bullet": "🚀",
    "blitz": "⚡",
    "rapid": "⏲️",
    "daily": "🗓️"
  }
  
  won = 'Won';
  lost = 'Lost';
  draw = 'Draw';
  wldLabels: string[] = [this.won, this.lost, this.draw];

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

    // Build the data for the pie charts for won/lost/draw
    for (const key in this.data) {
      if (key.includes(this.won)) {
        this.wonData[key] = this.data[key];
        wonGames += this.data[key];
      } else if (key.includes(this.lost)) {
        this.lostData[key] = this.data[key];
        lostGames += this.data[key];
      } else if (key.includes(this.draw)) {
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
  convertTitle(gameConfig: string): string {
    console.log(gameConfig);
    const gameConfigArr = gameConfig.split(':');
    const timeControl = this.convertTimeControl(gameConfigArr[1]);
    const timeClass = this.convertTimeClass(gameConfigArr[2]);

    return `${timeClass} ${timeControl}`;
  }

  private convertTimeClass(timeClass: string): string {
    return this.timeClass[timeClass];
  }

  private convertTimeControl(timeControl: string): string {
    // TODO: Use regex instead to convert
    // Is it a daily game such as 1/86400 (24 hours to make a move)
    if (timeControl.includes('/')) {
      const dailyTime = timeControl.split('/');
      if (dailyTime.length <= 1) {
        return "time is broken";
      }

      const secondsPerMove = parseInt(dailyTime[1]);
      const daysPerMove = secondsPerMove / (24 * 60 * 60);
      return `${daysPerMove} days/move`;

    }

    // Time is in seconds, but check for +x which signifies +x seconds added after making a move
    if (timeControl.includes('+')) {
      const time = timeControl.split('+');

      if (time.length <= 1) {
        return "+ time is broken";
      }

      const extraSeconds = time[1];
      const secondsPerMove = this.convertSecondsToTime(time[0]);

      return `${secondsPerMove} | ${extraSeconds}`;
    }

    return this.convertSecondsToTime(timeControl);
  }

  private convertSecondsToTime(seconds: string): string {
    const secondsPerMove = parseInt(seconds);
    if (secondsPerMove < 60) {
      return `${secondsPerMove} seconds`;
    } else {
      const minutesPerMove = secondsPerMove / 60;
      return `${minutesPerMove} ${minutesPerMove === 1 ? "minute" : "minutes"}`;
    }
  }

}
