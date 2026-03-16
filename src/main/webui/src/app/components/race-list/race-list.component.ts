import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RaceService } from '../../services/race.service';
import { Race, RACE_CATEGORIES, MEDAL_TYPES } from '../../models/race.model';
import { RouteMapComponent } from '../route-map/route-map.component';

@Component({
  selector: 'app-race-list',
  imports: [RouterLink, FormsModule, RouteMapComponent],
  template: `
    <div class="container">
      <h2>My Races</h2>

      <div class="filters">
        <input type="text" placeholder="Search by name..." [ngModel]="searchName()" (ngModelChange)="searchName.set($event); load()" />
        <select [ngModel]="filterCategory()" (ngModelChange)="filterCategory.set($event); load()">
          <option value="">All Categories</option>
          @for (c of categories; track c.value) {
            <option [value]="c.value">{{ c.label }}</option>
          }
        </select>
        <select [ngModel]="filterMedal()" (ngModelChange)="filterMedal.set($event); load()">
          <option value="">All Medals</option>
          @for (m of medalTypes; track m.value) {
            <option [value]="m.value">{{ m.label }}</option>
          }
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th></th>
            @for (col of columns; track col.field) {
              <th class="sortable" (click)="toggleSort(col.field)">
                {{ col.label }}
                @if (sortField() === col.field) {
                  <span>{{ sortDir() === 'asc' ? '▲' : '▼' }}</span>
                }
              </th>
            }
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (race of races(); track race.id) {
            <tr>
              <td>
                @if (race.imagePath) {
                  <img [src]="'/zelus/api/images/' + race.imagePath" class="thumb" alt="medal" />
                }
              </td>
              <td>{{ race.name }}</td>
              <td>{{ race.raceDate }}</td>
              <td>{{ race.distance }} km</td>
              <td>{{ categoryLabel(race.category) }}</td>
              <td>{{ medalLabel(race.medalType) }}</td>
              <td>{{ race.location }}</td>
              <td class="actions">
                <a [routerLink]="['/edit', race.id]" class="btn btn-sm">Edit</a>
                <button class="btn btn-sm btn-danger" (click)="remove(race)">Delete</button>
                @if (race.stravaActivityId) {
                  <a [href]="'https://www.strava.com/activities/' + race.stravaActivityId" target="_blank" class="btn btn-sm btn-strava">Strava ↗</a>
                }
              </td>
            </tr>
            @if (race.stravaPolyline) {
              <tr>
                <td [attr.colspan]="columns.length + 2">
                  <app-route-map [polyline]="race.stravaPolyline" />
                </td>
              </tr>
            }
          } @empty {
            <tr><td [attr.colspan]="columns.length + 2" class="empty">No races found.</td></tr>
          }
        </tbody>
      </table>

      <div class="pagination">
        <button [disabled]="page() === 0" (click)="page.set(page() - 1); load()">← Prev</button>
        <span>Page {{ page() + 1 }}</span>
        <button [disabled]="races().length < pageSize()" (click)="page.set(page() + 1); load()">Next →</button>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 1.5rem; max-width: 1100px; margin: auto; }
    .filters { display: flex; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .filters input, .filters select { padding: 0.5rem; border: 1px solid #ddd; border-radius: 6px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.6rem 0.75rem; text-align: left; border-bottom: 1px solid #eee; }
    th.sortable { cursor: pointer; user-select: none; }
    th.sortable:hover { background: #f5f5f5; }
    .thumb { width: 40px; height: 40px; object-fit: cover; border-radius: 6px; }
    .actions { display: flex; gap: 0.4rem; }
    .btn { padding: 0.3rem 0.7rem; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; font-size: 0.85rem; background: #16213e; color: #fff; }
    .btn-danger { background: #c0392b; }
    .btn-strava { background: #fc4c02; }
    .pagination { display: flex; align-items: center; gap: 1rem; margin-top: 1rem; justify-content: center; }
    .pagination button { padding: 0.4rem 1rem; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; background: #fff; }
    .pagination button:disabled { opacity: 0.4; cursor: default; }
    .empty { text-align: center; color: #999; padding: 2rem; }
  `]
})
export class RaceListComponent implements OnInit {
  private svc = inject(RaceService);

  races = signal<Race[]>([]);
  page = signal(0);
  pageSize = signal(20);
  sortField = signal('raceDate');
  sortDir = signal<'asc' | 'desc'>('desc');
  searchName = signal('');
  filterCategory = signal('');
  filterMedal = signal('');

  categories = RACE_CATEGORIES;
  medalTypes = MEDAL_TYPES;
  columns = [
    { field: 'name', label: 'Name' },
    { field: 'raceDate', label: 'Date' },
    { field: 'distance', label: 'Distance' },
    { field: 'category', label: 'Category' },
    { field: 'medalType', label: 'Medal' },
    { field: 'location', label: 'Location' },
  ];

  ngOnInit() { this.load(); }

  load() {
    const sort = (this.sortDir() === 'desc' ? '-' : '') + this.sortField();
    this.svc.list({
      page: this.page(), size: this.pageSize(), sort,
      category: this.filterCategory() || undefined,
      medalType: this.filterMedal() || undefined,
      name: this.searchName() || undefined,
    }).subscribe(data => this.races.set(data));
  }

  toggleSort(field: string) {
    if (this.sortField() === field) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDir.set('asc');
    }
    this.load();
  }

  remove(race: Race) {
    if (confirm(`Delete "${race.name}"?`)) {
      this.svc.delete(race.id!).subscribe(() => this.load());
    }
  }

  categoryLabel(val: string) { return this.categories.find(c => c.value === val)?.label ?? val; }
  medalLabel(val: string) { return this.medalTypes.find(m => m.value === val)?.label ?? val; }
}
