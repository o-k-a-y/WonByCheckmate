import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/config-service';

// This component makes up both the overall pie chart for a specific game configuration (i.e. bullet 30 seconds)
// and the sub pie charts for won/lost/draw when that main chart is clicked
@Component({
  selector: 'app-wld-pie-charts',
  templateUrl: './wld-pie-charts.component.html',
  styleUrls: ['./wld-pie-charts.component.scss']
})
export class WldPieChartsComponent implements OnInit {
  @Input() data!: Record<string, number>;
  @Input() timeClass: string = "";
  @Input() timeControl: string = "";
  
  wonData: Record<string, number> = {};
  lostData: Record<string, number> = {};
  drawData: Record<string, number> = {};
  wldData: Record<string, number> = {};
  
  wldLabels: string[] = ['Won', 'Lost', 'Draw'];
  
  shouldShowDetailedCharts: boolean = false;
  
  get title(): string {
    return this.configService.convertTitle(this.timeClass, this.timeControl);
  }

  constructor(public configService: ConfigService) { }

  ngOnInit(): void {
    console.log(this.data);
    
    let wonGames = 0;
    let lostGames = 0;
    let drawGames = 0;

    // Build the data for the pie charts for won/lost/draw
    for (const key in this.data) {
      if (key.includes(this.configService.won)) {
        this.wonData[key] = this.data[key];
        wonGames += this.data[key] as number;
      } else if (key.includes(this.configService.lost)) {
        this.lostData[key] = this.data[key];
        lostGames += this.data[key] as number;
      } else if (key.includes(this.configService.draw)) {
        this.drawData[key] = this.data[key];
        drawGames += this.data[key] as number;
      }
    }

    this.wldData[this.configService.won] = wonGames;
    this.wldData[this.configService.draw] = lostGames;
    this.wldData[this.configService.lost] = drawGames; 
  }

  toggleShowDetailedCharts() {
    this.shouldShowDetailedCharts = !this.shouldShowDetailedCharts;
  }
}
