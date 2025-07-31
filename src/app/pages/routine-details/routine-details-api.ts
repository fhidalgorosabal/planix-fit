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

  getDayRoutine(day: string): DayRoutine | undefined {
    const currentCache = this.cache();
    if (!currentCache || !day) return undefined;
    return currentCache.find((routine) => routine.day === day);
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

  updateExercise(day: string, exercise: Exercise): boolean {
    const currentCache = this.cache();
    if (!currentCache) return false;

    const updatedCache = currentCache.map((routine) => {
      if (routine.day === day) {
        const updatedList = routine.list.map((ex) =>
          ex.id === exercise.id ? exercise : ex
        );
        return { ...routine, list: updatedList };
      }
      return routine;
    });

    this.cache.set(updatedCache);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedCache));
    return true;
  }

  addExercise(day: string, exercise: Exercise): boolean {
    const currentCache = this.cache();
    if (!currentCache) return false;

    const updatedCache = currentCache.map((routine) => {
      if (routine.day === day) {
        const maxId = Math.max(...routine.list.map((ex) => parseInt(ex.id)), 0);
        const newExercise = { ...exercise, id: (maxId + 1).toString() };
        return { ...routine, list: [...routine.list, newExercise] };
      }
      return routine;
    });

    this.cache.set(updatedCache);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedCache));
    return true;
  }

  deleteExercise(day: string, exerciseId: string): boolean {
    const currentCache = this.cache();
    if (!currentCache) return false;

    const updatedCache = currentCache.map((routine) => {
      if (routine.day === day) {
        const updatedList = routine.list.filter((ex) => ex.id !== exerciseId);
        return { ...routine, list: updatedList };
      }
      return routine;
    });

    this.cache.set(updatedCache);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedCache));
    return true;
  }

  refreshSignal(day: string) {
    localStorage.removeItem(this.STORAGE_KEY);
    this.cache.set(null);
    this.loadDataIfNeeded();
    return signal<Exercise[]>(this.getExercisesByDay(day));
  }
}
