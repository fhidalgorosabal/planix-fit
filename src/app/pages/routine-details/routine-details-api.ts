import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DayRoutine, Exercise } from './routine-details-model';

@Injectable({
  providedIn: 'root',
})
export class RoutineDetailsApi {
  private httpClient = inject(HttpClient);
  private readonly STORAGE_KEY = 'routine-details-cache';

  private cache = signal<DayRoutine[] | null>(null);

  getExercisesByDay(day: string): Exercise[] {
    const currentCache = this.cache();
    if (!currentCache || !day) return [];
    return currentCache.find((routine) => routine.day === day)?.list || [];
  }

  loadDataIfNeeded(): void {
    if (this.cache()) return;

    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsedData = JSON.parse(stored) as DayRoutine[];
        this.cache.set(parsedData);
        return;
      } catch (e) {
        console.error('Error al parsear datos del localStorage:', e);
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }

    this.httpClient
      .get<DayRoutine[]>('data/routine-details-data.json')
      .subscribe({
        next: (data) => {
          this.cache.set(data);
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        },
        error: (err) => {
          console.error('Error cargando rutina:', err);
          this.cache.set([]);
        },
      });
  }

  refreshSignal(day: string) {
    localStorage.removeItem(this.STORAGE_KEY);
    this.cache.set(null);
    this.loadDataIfNeeded();
    return signal<Exercise[]>(this.getExercisesByDay(day));
  }
}
