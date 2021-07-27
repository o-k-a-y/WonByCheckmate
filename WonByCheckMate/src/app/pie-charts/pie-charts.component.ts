import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pie-charts',
  templateUrl: './pie-charts.component.html',
  styleUrls: ['./pie-charts.component.scss']
})
export class PieChartsComponent implements OnInit {
  @Input() data;

  // list of lists for labels
  // Won By Resignation, Won by TimeOut 
  // win, loss, draw, win/loss/draw (collective) for the given game config
  // maybe break up also into larger group like blitz, bullet, etc..

  gameConfigs;
  labels: string[] = [];
  wonLabels: string[] = [];
  drawLabels: string[] = [];
  lostLabels: string[] = [];
  
  constructor() { }

  ngOnInit(): void {
    this.gameConfigs = Object.keys(this.data);
    this.labels = Object.keys(this.data[this.gameConfigs[0]]); // terrible, maybe rewrite returned JSON

    // console.log(this.tableRows);
    // console.log(this.tableCols);
    // console.log(this.data);

    this.labels.forEach(element => {
      if (element.includes('Won')) {
        this.wonLabels.push(this.filterLabel(element));
      } else if (element.includes('Draw')) {
        this.drawLabels.push(this.filterLabel(element));
      } else if (element.includes('Lost')) {
        this.lostLabels.push(this.filterLabel(element));
      }
    });

    // console.log(this.wonLabels);
    // console.log(this.drawLabels);
    // console.log(this.lostLabels);
  }

  // TODO: Inject config service and use that instead of this function
  // Turn something like wonByResignation into Resignation for easier user readability
  filterLabel(label: string) {
    return label.split('By')[1];
  }
}
