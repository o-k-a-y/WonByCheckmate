import { Component, Input, OnInit } from '@angular/core';

// This component makes up all the pie charts for a specific time class
@Component({
  selector: 'app-time-class-pie-charts',
  templateUrl: './time-class-pie-charts.component.html',
  styleUrls: ['./time-class-pie-charts.component.scss']
})
export class TimeClassPieChartsComponent implements OnInit {
  @Input() data: any; // TODO: assign a type
  @Input() timeClass: string = "";

  timeControls: string[] = [];
  constructor() { }

  ngOnInit(): void {
    this.timeControls = Object.keys(this.data);
    // console.log(this.data);
  }
}
