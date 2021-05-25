import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() tableRows: string[] = [];
  @Input() tableCols: string[] = [];
  @Input() data: any = {};

  constructor() { }

  ngOnInit(): void {
  }
}
