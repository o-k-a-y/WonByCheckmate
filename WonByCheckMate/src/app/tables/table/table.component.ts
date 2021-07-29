import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/config-service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() data: any = {};
  @Input() timeClass: string;
  @Input() outcome: string;

  rows: string[] = []; // time controls
  cols: string[] = []; // results
  title: string;

  constructor(public configService: ConfigService) { }

  ngOnInit(): void {
    this.title = `${this.configService.convertTimeClass(this.timeClass)} ${this.outcome}`;
    this.rows = Object.keys(this.data);

    // Get the columns from just the first time control object (probably should be refactored)
    for (const row of this.rows) {
      this.cols = Object.keys(this.data[row]);
      break;
    }

  }
}
