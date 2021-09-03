import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/config-service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() data!: any[];

  cols: string[] = []; // results

  constructor(public configService: ConfigService) { }

  ngOnInit(): void {
    // Get the columns from just the first time control object (probably should be refactored)
      for (const row in this.data) {
      this.cols = Object.keys(this.data[row]);
      break;
    }
  }
}
