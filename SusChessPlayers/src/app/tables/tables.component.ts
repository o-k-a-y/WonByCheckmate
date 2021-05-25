import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {
  @Input() data;

  tableRows;
  tableCols;
  wonCols: string[] = [];
  drawCols: string[] = [];
  lostCols: string[] = [];
  constructor() {}

  ngOnInit(): void {
    this.tableRows = Object.keys(this.data);
    this.tableCols = Object.keys(this.data[this.tableRows[0]]); // terrible, maybe rewrite returned JSON
    console.log(this.tableRows);
    console.log(this.tableCols);
    console.log(this.data);

    this.tableCols.forEach(element => {
      if (element.includes('Won')) {
        this.wonCols.push(element);
      } else if (element.includes('Draw')) {
        this.drawCols.push(element);
      } else if (element.includes('Lost')) {
        this.lostCols.push(element);
      }
    });

    console.log(this.wonCols);
    console.log(this.drawCols);
    console.log(this.lostCols);
  }


}
