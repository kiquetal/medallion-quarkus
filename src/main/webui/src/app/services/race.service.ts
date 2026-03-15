import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Race, Stats } from '../models/race.model';

@Injectable({ providedIn: 'root' })
export class RaceService {
  private http = inject(HttpClient);

  list(params: { page?: number; size?: number; sort?: string; category?: string; medalType?: string; name?: string } = {}): Observable<Race[]> {
    let httpParams = new HttpParams();
    if (params.page != null) httpParams = httpParams.set('page', params.page);
    if (params.size != null) httpParams = httpParams.set('size', params.size);
    if (params.sort) httpParams = httpParams.set('sort', params.sort);
    if (params.category) httpParams = httpParams.set('category', params.category);
    if (params.medalType) httpParams = httpParams.set('medalType', params.medalType);
    if (params.name) httpParams = httpParams.set('name', params.name);
    return this.http.get<Race[]>('/api/races', { params: httpParams });
  }

  get(id: number): Observable<Race> {
    return this.http.get<Race>(`/api/races/${id}`);
  }

  create(race: Race): Observable<Race> {
    return this.http.post<Race>('/api/races', race);
  }

  update(id: number, race: Race): Observable<Race> {
    return this.http.put<Race>(`/api/races/${id}`, race);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/races/${id}`);
  }

  uploadImage(file: File): Observable<{ filename: string }> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<{ filename: string }>('/api/images', fd);
  }

  getStats(): Observable<Stats> {
    return this.http.get<Stats>('/api/stats');
  }
}
