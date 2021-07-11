import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Chart } from 'chart.js'

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit, AfterViewInit {

  @Input() labels: string[] = [];
  @Input() data: {} = {};
  @Input() title: string;

  // @Output() clickedSection: EventEmitter<string> = new EventEmitter<string>();
  
  @ViewChild('myChart') chartRef: ElementRef;


  chart: Chart;
  ctx: any;
  canvas: any;

  // https://coolors.co/ef476f-ffd166-06d6a0-118ab2-073b4c
  // https://coolors.co/ff595e-ffca3a-8ac926-1982c4-6a4c93
  labelColor: {} = {
    "Resignation": "#ef476f",
    "Timeout": "#ffd166",
    "Checkmate": "#06d6a0",
    "Abandonment": "#118ab2",
    "Agreement": "#ef476f",
    "Stalemate": "#ffd166",
    "Repetition": "#06d6a0",
    "InsufficientMaterial": "#118ab2",
    "TimeoutVsInsufficientMaterial": "#6a4c93",
    "50Move": "#ff7d00",
    "Won": "#06d6a0",
    "Lost": "#ef476f",
    "Draw": "#ffd166"
  }

  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    this.canvas = this.chartRef.nativeElement;
    let ctx = this.canvas.getContext('2d');

    // The actual chart
    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.labels,

        datasets: [{
          label: 'Find a more meaningful label for each type of chart',
          data: this.extractResults(this.data),
          backgroundColor: this.labels.map(label => this.hexToRgba(this.labelColor[label], 0.7)),
          borderColor: this.labels.map(label => this.hexToRgba(this.labelColor[label], 1)),
          borderWidth: 1
        }]
      },
      options: {
        // onClick: (e, a, c) => {
        //   if (!a[0]) {
        //     return;
        //   }
        //   console.log("clicked");
        //   const index = a[0].index;          
        //   if (index >= 0) {
        //     const label: string = this.chart.data.labels[index] as string;
        //     this.clickedSection.emit(label);
        //   }
        // },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: this.title
          },
          legend: {
            position: 'left',
          },
        }
      }
    });
  }

  private extractResults(data: {}): number[] {
    return Object.values(data);
  }

  // Only works with 6 char hex values
  private hexToRgba(hex, alpha) {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `rgba(${r},${g},${b},${alpha})`;
  };
}
