import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() data;

  tableRows;
  tableCols;
  constructor() { }

  ngOnInit(): void {
    this.tableRows = Object.keys(this.data);
    this.tableCols = Object.keys(this.data[this.tableRows[0]]); // terrible
    console.log(this.tableRows);
    console.log(this.tableCols);
    console.log(this.data);
  }

}
