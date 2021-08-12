import { Component, EventEmitter, Output } from '@angular/core';
import { PieChartComponent } from '../pie-chart/pie-chart.component';

@Component({
  selector: 'app-wld-pie-chart',
  templateUrl: './wld-pie-chart.component.html',
  styleUrls: ['./wld-pie-chart.component.scss']
})
export class WldPieChartComponent extends PieChartComponent {
  @Output() clickedSection: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.chart!.options.onClick = (e, a, c) => {
      // No data in the active element
      if (!a[0]) {
        return;
      }
      // console.log("clicked");
      
      // If a valid index is clicked in the pie chart, emit an event
      const index = a[0].index;          
      if (index >= 0) {
        if (this.chart != undefined && this.chart.data != undefined && this.chart.data.labels != undefined) {
          const label: string = this.chart.data.labels[index] as string;
          this.clickedSection.emit(label);
        }
      }
    }
  }
}
