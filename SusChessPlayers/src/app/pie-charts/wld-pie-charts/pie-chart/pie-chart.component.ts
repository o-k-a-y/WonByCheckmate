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
    this.colors = this.generateColors(this.labels.length);
    

    console.log('please look here');
    console.log(this.data);
  }

  @ViewChild('myChart') myChart: ElementRef;

  ngAfterViewInit(): void {
    this.canvas = this.myChart.nativeElement;
    var ctx = this.canvas.getContext('2d');

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'What is this label for?',
          data: this.extractResults(),
          // Randomly choose these colors, but make it deterministic so no two colors are repeated next to each other
          backgroundColor: this.colors.map(rgb => `rgba(${rgb},0.4)`),
          borderColor: this.colors.map(rgb => `rgba(${rgb},1)`),
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: this.title
          }
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

  extractResults(): number[] {
    return Object.values(this.data);
  }
}
