import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { DayRoutine, Exercise } from './routine-details-model';

@Injectable({
  providedIn: 'root',
})
export class RoutineDetailsApi {
  private httpClient = inject(HttpClient);
  private readonly STORAGE_KEY = 'routine-details-cache';

  private cache: DayRoutine[] | null = null;
  private subject = new BehaviorSubject<Exercise[]>([]);

  getRoutineDetails(day: string): Observable<Exercise[]> {
    if (this.cache) {
      const result = this.cache.find((routine) => routine.day === day)?.list;
      result && this.subject.next(result);
      return this.subject.asObservable();
    }

    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.cache = JSON.parse(stored);
      const result = this.cache?.find((routine) => routine.day === day)?.list;
      result && this.subject.next(result);
      return this.subject.asObservable();
    }

    this.httpClient
      .get<DayRoutine[]>('data/routine-details-data.json')
      .subscribe({
        next: (data) => {
          this.cache = data;
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
          const result = data.find((routine) => routine.day === day)?.list;
          result && this.subject.next(result);
        },
        error: (err) => {
          console.error('Error cargando rutina:', err);
          this.subject.next([]);
        },
      });

    return this.subject.asObservable();
  }

  refresh(day: string): Observable<Exercise[] | undefined> {
    localStorage.removeItem(this.STORAGE_KEY);
    this.cache = null;
    return this.getRoutineDetails(day);
  }
}
