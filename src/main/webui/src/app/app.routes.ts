import { Routes } from '@angular/router';
import { RaceListComponent } from './components/race-list/race-list.component';
import { RaceFormComponent } from './components/race-form/race-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: RaceListComponent },
  { path: 'new', component: RaceFormComponent },
  { path: 'edit/:id', component: RaceFormComponent },
  { path: 'dashboard', component: DashboardComponent },
];
