import { Component, Input, OnInit } from '@angular/core';
import { ChessStats } from '../models/chess-stats.model';
import { ConfigService } from '../services/config-service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {
  @Input() data!: ChessStats;

  tables: {} = {};
  // tables: Map<string, object> = new Map<string, object>(); // could be used for type safety?

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.tables = this.constructTables();
    // console.log(this.tables);
  }


  // Constructs data where each time class has won, lost, draw and each of those contain the time controls and respective results
  // Each time class is structured as follows
  /*
    "won": {
      "600": {
        "wonByResignation": 0,
        "wonByTimeout": 0,
        "wonByCheckmate": 1,
        "wonByAbandonment": 0
        ...
      },
      "900": {
        "wonByResignation": 0,
        "wonByTimeout": 0,
        "wonByCheckmate": 0,
        "wonByAbandonment": 0
        ...
      },
    },
    "lost": {
      ...
    },
    "draw": {
      ...
    }
  */
  private constructTables(): {} {
    const tables = {};

    Object.keys(this.data).forEach(timeClass => {
      tables[timeClass] = {};
      tables[timeClass]['won'] = {};
      tables[timeClass]['lost'] = {};
      tables[timeClass]['draw'] = {};
      
      Object.keys(this.data[timeClass]).forEach(timeControl => {
        tables[timeClass]['won'][timeControl] = {};
        tables[timeClass]['lost'][timeControl] = {};
        tables[timeClass]['draw'][timeControl] = {};

        Object.keys(this.data[timeClass][timeControl]).forEach(result => {
          const resultAmount = this.data[timeClass][timeControl][result];
          
          let outcome = '';
          if (result.includes('won')) {
            outcome = 'won';
          } else if (result.includes('lost')) {
            outcome = 'lost';
          } else if (result.includes('draw')) {
            outcome = 'draw';
          }
          
          // Modify the data so that wonByResignation -> Resignation for nicer display in the tables
          result = this.configService.convertLabel(result);
          tables[timeClass][outcome][timeControl][result] = resultAmount;
        })
      })
    });

    return tables;
  }
}