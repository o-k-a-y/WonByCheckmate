import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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

  ctx: any;
  canvas: any;

  colors: string[];

  ngOnInit(): void {
    // let num = this.labels.length;
    // while (num != 0) {
    //   this.labels[num-1] = 'test';
    //   num--;
    // }
    // this.labels.forEach(x => x = "test");
    this.colors = this.generateColors(this.labels.length);
  }

  @ViewChild('myChart') myChart: ElementRef;

  ngAfterViewInit(): void {
    this.canvas = this.myChart.nativeElement;
    let ctx = this.canvas.getContext('2d');

    // The actual chart
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.labels,
        datasets: [{
          // label: 'What is this label for?',
          data: this.extractResults(this.data),
          // Randomly choose these colors, but make it deterministic so no two colors are repeated next to each other
          backgroundColor: this.colors.map(rgb => `rgba(${rgb},0.4)`),
          borderColor: this.colors.map(rgb => `rgba(${rgb},1)`),
          borderWidth: 1
        }]
      },
      options: {
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

  // Returns a random rgb color without the alpha value
  randomRgb(): string {
    const hex = 255;
    const r = Math.floor(Math.random() * hex);
    const g = Math.floor(Math.random() * hex);
    const b = Math.floor(Math.random() * hex);

    return `${r},${g},${b}`;
  }

  generateColors(numColors: number): string[] {
    let colors: Set<string> = new Set<string>();

    while (colors.size != numColors) {
      colors.add(this.randomRgb());
    }
    return [...colors];
  }

  extractResults(data: {}): number[] {
    return Object.values(data);
  }
}
