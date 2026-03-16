import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DecimalPipe, SlicePipe } from '@angular/common';
import { RaceService } from '../../services/race.service';
import { StravaService } from '../../services/strava.service';
import { StravaActivity } from '../../models/strava.model';
import { ACTIVITY_TYPES, RACE_CATEGORIES, MEDAL_TYPES } from '../../models/race.model';
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'app-race-form',
  imports: [ReactiveFormsModule, DecimalPipe, SlicePipe],
  template: `
    <div class="container">
      <h2>{{ isEdit() ? 'Edit Activity' : 'New Activity' }}</h2>
      <form [formGroup]="form" (ngSubmit)="save()">
        <label>Type
          <select formControlName="activityType">
            @for (t of activityTypes; track t.value) {
              <option [value]="t.value">{{ t.label }}</option>
            }
          </select>
        </label>
        <label>Name <input formControlName="name" /></label>
        <label>Date <input type="date" formControlName="raceDate" /></label>
        <label>Distance (km) <input type="number" step="0.01" formControlName="distance" /></label>
        <label>Finish Time <input formControlName="finishTime" placeholder="H:MM:SS" /></label>
        <label>Location <input formControlName="location" /></label>
        <label>Category
          <select formControlName="category">
            @for (c of categories; track c.value) {
              <option [value]="c.value">{{ c.label }}</option>
            }
          </select>
        </label>
        @if (form.get('activityType')?.value === 'RACE') {
          <label>Medal Type
            <select formControlName="medalType">
              @for (m of medalTypes; track m.value) {
                <option [value]="m.value">{{ m.label }}</option>
              }
            </select>
          </label>
        }
        <label>Notes <textarea formControlName="notes" rows="3"></textarea></label>
        <label>Medal Photo
          <input type="file" accept="image/*" (change)="onFileSelected($event)" />
        </label>
        @if (stravaActivities().length) {
          <label>Link Strava Activity
            <select [value]="form.get('stravaActivityId')?.value || ''" (change)="onStravaSelect($event)">
              <option value="">— None —</option>
              @for (a of stravaActivities(); track a.id) {
                <option [value]="a.id">{{ a.startDateLocal | slice:0:10 }} — {{ a.name }} ({{ a.distance / 1000 | number:'1.1-1' }} km)</option>
              }
            </select>
          </label>
        }
        @if (previewUrl()) {
          <img [src]="previewUrl()" class="preview" alt="preview" />
        }
        <div class="form-actions">
          <button type="submit" class="btn" [disabled]="form.invalid || saving()">
            {{ saving() ? 'Saving...' : (isEdit() ? 'Update' : 'Create') }}
          </button>
          <button type="button" class="btn btn-secondary" (click)="cancel()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container { padding: 1.5rem; max-width: 600px; margin: auto; }
    form { display: flex; flex-direction: column; gap: 0.75rem; }
    label { display: flex; flex-direction: column; gap: 0.25rem; font-weight: 500; }
    input, select, textarea { padding: 0.5rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; }
    .preview { max-width: 200px; border-radius: 8px; margin-top: 0.5rem; }
    .form-actions { display: flex; gap: 0.75rem; margin-top: 0.5rem; }
    .btn { padding: 0.6rem 1.5rem; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; background: #1a1a2e; color: #fff; }
    .btn:disabled { opacity: 0.5; }
    .btn-secondary { background: #777; }
  `]
})
export class RaceFormComponent implements OnInit {
  private svc = inject(RaceService);
  private stravaSvc = inject(StravaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  activityTypes = ACTIVITY_TYPES;
  categories = RACE_CATEGORIES;
  medalTypes = MEDAL_TYPES;
  isEdit = signal(false);
  saving = signal(false);
  previewUrl = signal<string | null>(null);
  selectedFile: File | null = null;
  stravaActivities = signal<StravaActivity[]>([]);
  private raceId = 0;

  form = this.fb.group({
    name: ['', Validators.required],
    raceDate: [''],
    distance: [0],
    finishTime: [''],
    location: [''],
    activityType: ['RACE'],
    category: ['FIVE_K'],
    medalType: ['NONE'],
    notes: [''],
    imagePath: [''],
    stravaActivityId: [null as number | null],
    stravaPolyline: [''],
  });

  ngOnInit() {
    this.stravaSvc.getStatus().subscribe(s => {
      if (s.connected) this.stravaSvc.getActivities().subscribe(a => this.stravaActivities.set(a));
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.raceId = +id;
      this.svc.get(this.raceId).subscribe(race => {
        this.form.patchValue(race as any);
        if (race.imagePath) this.previewUrl.set('/zelus/api/images/' + race.imagePath);
      });
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      this.previewUrl.set(URL.createObjectURL(file));
    }
  }

  save() {
    this.saving.set(true);
    const upload$ = this.selectedFile
      ? this.svc.uploadImage(this.selectedFile)
      : of(null as { filename: string } | null);

    upload$.pipe(
      switchMap((result: { filename: string } | null) => {
        const val = { ...this.form.value } as any;
        if (result) val.imagePath = result.filename;
        if (val.activityType !== 'RACE') val.medalType = null;
        return this.isEdit()
          ? this.svc.update(this.raceId, val)
          : this.svc.create(val);
      })
    ).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.saving.set(false),
    });
  }

  cancel() { this.router.navigate(['/']); }

  onStravaSelect(event: Event) {
    const id = +(event.target as HTMLSelectElement).value;
    if (!id) {
      this.form.patchValue({ stravaActivityId: null, stravaPolyline: '' });
      return;
    }
    const activity = this.stravaActivities().find(a => a.id === id);
    this.form.patchValue({
      stravaActivityId: id,
      stravaPolyline: activity?.map?.summaryPolyline || ''
    });
  }
}
