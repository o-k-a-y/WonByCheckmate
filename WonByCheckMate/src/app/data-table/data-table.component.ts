import { Component, Input } from '@angular/core';

export type DataTableItem = Record<string, number>;

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent {

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  @Input() displayedColumns!: string[];
  @Input() tableData!: DataTableItem[];

  ngOnInit() {
    console.log(this.displayedColumns);
    console.log(this.tableData);
  }
}