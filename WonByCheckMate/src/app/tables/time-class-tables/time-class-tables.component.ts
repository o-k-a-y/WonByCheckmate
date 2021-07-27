import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/config-service';

@Component({
  selector: 'app-time-class-tables',
  templateUrl: './time-class-tables.component.html',
  styleUrls: ['./time-class-tables.component.scss']
})
export class TimeClassTablesComponent implements OnInit {
  @Input() timeClassTables: {};
  @Input() timeClass: string;

  wonTable: {};
  lostTable: {};
  drawTable: {};

  constructor(public configService: ConfigService) { }

  ngOnInit(): void {
    this.wonTable = this.timeClassTables[this.configService.won];
    this.lostTable = this.timeClassTables[this.configService.lost];
    this.drawTable = this.timeClassTables[this.configService.draw];
  }

}
