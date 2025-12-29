import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="chart-container" [style.height]="height">
      <canvas
        baseChart
        [type]="type"
        [data]="data"
        [options]="options"
      ></canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      width: 100%;
    }
  `]
})
export class ChartComponent implements AfterViewInit {
  @Input() type: ChartType = 'bar';
  @Input() data!: ChartConfiguration['data'];
  @Input() options: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
  };
  @Input() height: string = '300px';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  ngAfterViewInit() {
    if (this.chart) {
      this.chart.update();
    }
  }
}
