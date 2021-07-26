import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {
  @Input() data;

  tables: {} = {};

  constructor() {}

  ngOnInit(): void {
    const timeClasses = Object.keys(this.data);

    // Refactor/change below loop to follow consistency
    if (timeClasses.length <= 0) {
      console.log('There is no data!')
      return;
    }

    timeClasses.forEach(timeClass => {
      this.tables[timeClass] = {};
      // console.log(this.data[timeClass]);
      
      Object.keys(this.data[timeClass]).forEach(timeControl => {
        this.tables[timeClass][timeControl] = {};
        this.tables[timeClass][timeControl]['won'] = {};
        this.tables[timeClass][timeControl]['lost'] = {};
        this.tables[timeClass][timeControl]['draw'] = {};

        Object.keys(this.data[timeClass][timeControl]).forEach(result => {
          const resultAmount = this.data[timeClass][timeControl][result];
          
          if (result.includes('won')) {
            this.tables[timeClass][timeControl]['won'][result] = resultAmount;
          } else if (result.includes('lost')) {
            this.tables[timeClass][timeControl]['lost'][result] = resultAmount;
          } else if (result.includes('draw')) {
            this.tables[timeClass][timeControl]['draw'][result] = resultAmount;
          }
        })

        // TODO: Make this work
        // this.tables[timeClass]['won'] = {};
        // this.tables[timeClass]['lost'] = {};
        // this.tables[timeClass]['draw'] = {};

        // this.tables[timeClass]['won'][timeControl] = {};
        // this.tables[timeClass]['lost'][timeControl] = {};
        // this.tables[timeClass]['draw'][timeControl] = {};

        // Object.keys(this.data[timeClass][timeControl]).forEach(result => {
        //   const resultAmount = this.data[timeClass][timeControl][result];
          
        //   if (result.includes('won')) {
        //     this.tables[timeClass]['won'][timeControl][result] = resultAmount;
        //   } else if (result.includes('lost')) {
        //     this.tables[timeClass]['lost'][timeControl][result] = resultAmount;
        //   } else if (result.includes('draw')) {
        //     this.tables[timeClass]['draw'][timeControl][result] = resultAmount;
        //   }
        // })
      })
    });

    console.log(this.tables);
  }


}
