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

  wonData: Record<string, string>[] = [];
  lostData: Record<string, string>[] = [];
  drawData: Record<string, string>[] = [];

  constructor(public configService: ConfigService) { }

  ngOnInit(): void {
    this.wonTable = this.timeClassTables[this.configService.won];
    this.lostTable = this.timeClassTables[this.configService.lost];
    this.drawTable = this.timeClassTables[this.configService.draw];

    this.wonData = this.flattenData(this.timeClassTables[this.configService.won], this.configService.won);
    this.lostData = this.flattenData(this.timeClassTables[this.configService.lost], this.configService.lost);
    this.drawData = this.flattenData(this.timeClassTables[this.configService.draw], this.configService.draw);
  }

  // Turn the data into a json array so that Angular Material can digest it better as a data source
  flattenData(table, outcome: string): Record<string, string>[] {
    let tableData: Record<string, string>[] = [];

    const timeControlArr = Object.keys(table);
    timeControlArr.forEach(timeControl => {
      const title = `${this.configService.convertTimeClass(this.timeClass)} ${outcome}`;

      const obj = {[title]: timeControl, ...table[timeControl]};
      tableData.push(obj);
    })

    return tableData;
  }
}
