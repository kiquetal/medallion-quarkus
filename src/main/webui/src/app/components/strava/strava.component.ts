import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, SlicePipe } from '@angular/common';
import { StravaService } from '../../services/strava.service';
import { StravaStatus, StravaStats, StravaActivity } from '../../models/strava.model';

@Component({
  selector: 'app-strava',
  imports: [FormsModule, DecimalPipe, SlicePipe],
  template: `
    <div class="container">
      <h2>🏃 Strava Integration</h2>

      @if (loading()) {
        <p>Loading...</p>
      } @else if (!status()?.configured) {
        <div class="config-box">
          <h3>Configure Strava API</h3>
          <p>Register your app at <a href="https://www.strava.com/settings/api" target="_blank">strava.com/settings/api</a>, then enter your credentials below.</p>
          <label>Client ID <input [(ngModel)]="clientId" /></label>
          <label>Client Secret <input type="password" [(ngModel)]="clientSecret" /></label>
          <button class="btn" (click)="saveConfig()">Save Configuration</button>
        </div>
      } @else if (!status()?.connected) {
        <div class="config-box">
          <h3>Connect to Strava</h3>
          <p>Your API credentials are configured. Click below to authorize Zelus to access your Strava data.</p>
          <a class="btn strava-btn" [href]="authorizeUrl">Connect with Strava</a>
        </div>
      } @else {
        <div class="profile-bar">
          @if (status()?.athleteProfile) {
            <img [src]="status()!.athleteProfile" class="avatar" alt="profile" />
          }
          <div>
            <strong>{{ status()!.athleteName }}</strong>
            <span class="sub">Connected to Strava</span>
          </div>
          <button class="btn btn-danger" (click)="disconnect()">Disconnect</button>
        </div>

        @if (stats()) {
          <div class="stats-grid">
            <div class="stat-card">
              <span class="big">{{ stats()!.allRunTotals?.count || 0 }}</span>
              <span>Total Runs</span>
              <span class="sub">{{ (stats()!.allRunTotals?.distance || 0) / 1000 | number:'1.0-0' }} km</span>
            </div>
            <div class="stat-card">
              <span class="big">{{ stats()!.allRideTotals?.count || 0 }}</span>
              <span>Total Rides</span>
              <span class="sub">{{ (stats()!.allRideTotals?.distance || 0) / 1000 | number:'1.0-0' }} km</span>
            </div>
            <div class="stat-card">
              <span class="big">{{ stats()!.allSwimTotals?.count || 0 }}</span>
              <span>Total Swims</span>
              <span class="sub">{{ (stats()!.allSwimTotals?.distance || 0) / 1000 | number:'1.1-1' }} km</span>
            </div>
          </div>
        }

        @if (activities().length) {
          <h3>Recent Activities</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th><th>Name</th><th>Type</th><th>Distance</th><th>Time</th><th>Elevation</th><th></th>
              </tr>
            </thead>
            <tbody>
              @for (a of activities(); track a.id) {
                <tr>
                  <td>{{ a.startDateLocal | slice:0:10 }}</td>
                  <td>{{ a.name }}</td>
                  <td>{{ a.sportType }}</td>
                  <td>{{ a.distance / 1000 | number:'1.1-1' }} km</td>
                  <td>{{ formatTime(a.movingTime) }}</td>
                  <td>{{ a.totalElevationGain | number:'1.0-0' }} m</td>
                  <td><a [href]="'https://www.strava.com/activities/' + a.id" target="_blank" class="link">View ↗</a></td>
                </tr>
              }
            </tbody>
          </table>
        }

        @if (lastSync()) {
          <p class="sync-info">Last synced: {{ lastSync() }}</p>
        }
      }
    </div>
  `,
  styles: [`
    .container { padding: 1.5rem; max-width: 1100px; margin: auto; }
    .config-box { background: #fff; border: 1px solid #eee; border-radius: 10px; padding: 1.5rem; max-width: 500px; }
    .config-box label { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 0.75rem; font-weight: 500; }
    .config-box input { padding: 0.5rem; border: 1px solid #ddd; border-radius: 6px; }
    .btn { padding: 0.6rem 1.5rem; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; background: #1a1a2e; color: #fff; text-decoration: none; display: inline-block; }
    .btn-danger { background: #c0392b; font-size: 0.85rem; padding: 0.4rem 1rem; }
    .strava-btn { background: #fc4c02; }
    .profile-bar { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; background: #fff; padding: 1rem; border-radius: 10px; border: 1px solid #eee; }
    .avatar { width: 48px; height: 48px; border-radius: 50%; }
    .sub { display: block; color: #888; font-size: 0.85rem; }
    .stats-grid { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { background: #1a1a2e; color: #fff; padding: 1.5rem; border-radius: 10px; text-align: center; flex: 1; }
    .big { display: block; font-size: 2rem; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 10px; overflow: hidden; }
    th, td { padding: 0.6rem 0.75rem; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f8f9fa; font-weight: 600; }
    .link { color: #fc4c02; text-decoration: none; font-weight: 500; }
    .sync-info { color: #888; font-size: 0.85rem; margin-top: 1rem; }
  `]
})
export class StravaComponent implements OnInit {
  private svc = inject(StravaService);

  loading = signal(true);
  status = signal<StravaStatus | null>(null);
  stats = signal<StravaStats | null>(null);
  activities = signal<StravaActivity[]>([]);
  lastSync = signal('');
  clientId = '';
  clientSecret = '';
  authorizeUrl = '/zelus/api/strava/authorize';

  ngOnInit() { this.loadStatus(); }

  loadStatus() {
    this.svc.getStatus().subscribe(s => {
      this.status.set(s);
      if (s.connected) this.loadData();
      else this.loading.set(false);
    });
  }

  loadData() {
    this.svc.getData().subscribe(d => {
      try { this.stats.set(JSON.parse(d.stats)); } catch {}
      try { this.activities.set(JSON.parse(d.activities)); } catch {}
      this.lastSync.set(d.lastSync);
      this.loading.set(false);
    });
  }

  saveConfig() {
    this.svc.saveConfig(this.clientId, this.clientSecret).subscribe(() => this.loadStatus());
  }

  disconnect() {
    if (confirm('Disconnect from Strava?')) {
      this.svc.disconnect().subscribe(() => {
        this.stats.set(null);
        this.activities.set([]);
        this.loadStatus();
      });
    }
  }

  formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
                  : `${m}:${String(s).padStart(2, '0')}`;
  }
}
