import { Component, inject, signal, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { RaceService } from '../../services/race.service';
import { Stats } from '../../models/race.model';

@Component({
  selector: 'app-dashboard',
  imports: [NgxChartsModule],
  template: `
    <div class="container">
      <h2>Dashboard</h2>

      @if (stats()) {
        <div class="summary-cards">
          <div class="card"><span class="big">{{ stats()!.totalRaces }}</span><span>Total Races</span></div>
          <div class="card"><span class="big">{{ stats()!.totalDistance | number:'1.1-1' }} km</span><span>Total Distance</span></div>
        </div>

        <div class="charts">
          <div class="chart-box">
            <h3>Races by Category</h3>
            <ngx-charts-bar-vertical
              [results]="categoryData()"
              [xAxisLabel]="'Category'"
              [yAxisLabel]="'Races'"
              [showXAxisLabel]="true"
              [showYAxisLabel]="true"
              [xAxis]="true"
              [yAxis]="true"
              [view]="[500, 300]">
            </ngx-charts-bar-vertical>
          </div>

          <div class="chart-box">
            <h3>Medals by Type</h3>
            <ngx-charts-pie-chart
              [results]="medalData()"
              [view]="[400, 300]"
              [labels]="true"
              [doughnut]="true">
            </ngx-charts-pie-chart>
          </div>

          <div class="chart-box full-width">
            <h3>Races per Year</h3>
            <ngx-charts-line-chart
              [results]="yearData()"
              [xAxisLabel]="'Year'"
              [yAxisLabel]="'Races'"
              [showXAxisLabel]="true"
              [showYAxisLabel]="true"
              [xAxis]="true"
              [yAxis]="true"
              [view]="[700, 300]">
            </ngx-charts-line-chart>
          </div>
        </div>
      } @else {
        <p>Loading stats...</p>
      }
    </div>
  `,
  styles: [`
    .container { padding: 1.5rem; max-width: 1100px; margin: auto; }
    .summary-cards { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
    .card { background: #1a1a2e; color: #fff; padding: 1.5rem; border-radius: 10px; text-align: center; flex: 1; }
    .big { display: block; font-size: 2rem; font-weight: 700; }
    .charts { display: flex; flex-wrap: wrap; gap: 1.5rem; }
    .chart-box { background: #fff; border: 1px solid #eee; border-radius: 10px; padding: 1rem; }
    .full-width { width: 100%; }
    h3 { margin: 0 0 0.75rem; }
  `]
})
export class DashboardComponent implements OnInit {
  private svc = inject(RaceService);

  stats = signal<Stats | null>(null);
  categoryData = signal<any[]>([]);
  medalData = signal<any[]>([]);
  yearData = signal<any[]>([]);

  ngOnInit() {
    this.svc.getStats().subscribe(s => {
      this.stats.set(s);
      this.categoryData.set(this.toChartData(s.racesPerCategory));
      this.medalData.set(this.toChartData(s.medalsByType));
      this.yearData.set([{
        name: 'Races',
        series: Object.entries(s.racesPerYear).map(([k, v]) => ({ name: k, value: v }))
      }]);
    });
  }

  private toChartData(map: Record<string, number>) {
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }
}
