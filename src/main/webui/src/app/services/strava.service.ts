import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StravaStatus, StravaData, StravaActivity } from '../models/strava.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StravaService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/zelus/api/strava`;

  getStatus(): Observable<StravaStatus> {
    return this.http.get<StravaStatus>(`${this.base}/status`);
  }

  saveConfig(clientId: string, clientSecret: string): Observable<void> {
    return this.http.post<void>(`${this.base}/config`, { clientId, clientSecret });
  }

  getData(): Observable<StravaData> {
    return this.http.get<StravaData>(`${this.base}/data`);
  }

  getActivities(): Observable<StravaActivity[]> {
    return this.http.get<StravaActivity[]>(`${this.base}/activities`);
  }

  disconnect(): Observable<void> {
    return this.http.delete<void>(`${this.base}/disconnect`);
  }

  getAuthorizeUrl(): string {
    return `${this.base}/authorize`;
  }
}
