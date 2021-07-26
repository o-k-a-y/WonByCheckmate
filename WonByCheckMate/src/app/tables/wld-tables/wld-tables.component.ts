import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-wld-tables',
  templateUrl: './wld-tables.component.html',
  styleUrls: ['./wld-tables.component.scss']
})
export class WldTablesComponent implements OnInit {
  @Input() wldTables: {};
  @Input() timeClass: string;

  constructor() { }

  ngOnInit(): void {
    console.log(this.timeClass);
    console.log(this.wldTables);
  }

}
