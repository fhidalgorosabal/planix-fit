import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DayRoutine, Exercise, ExerciseBase } from './routine-details-model';

@Injectable({
  providedIn: 'root',
})
export class RoutineDetailsApi {
  private httpClient = inject(HttpClient);
  private readonly ROUTINE_STORAGE_KEY = 'routine-details-cache';
  private readonly EXERCISE_STORAGE_KEY = 'exercise-base-cache';

  private routineCache = signal<DayRoutine[] | null>(null);
  private exerciseBaseCache = signal<ExerciseBase[] | null>(null);

  getExercisesByDay(day: string): Exercise[] {
    const currentCache = this.routineCache();
    if (!currentCache || !day) return [];
    return currentCache.find((routine) => routine.day === day)?.list || [];
  }

  getDayRoutine(day: string): DayRoutine | undefined {
    const currentCache = this.routineCache();
    if (!currentCache || !day) return undefined;
    return currentCache.find((routine) => routine.day === day);
  }

  getCachedExercisesBase(): ExerciseBase[] {
    return this.exerciseBaseCache() || [];
  }

  getLastExerciseId(): number {
    const all = this.routineCache() || [];
    const ids = all.flatMap((r) => r.list.map((ex) => parseInt(ex.id, 10)));
    const maxId = ids.length ? Math.max(...ids) : 0;
    return maxId;
  }

  refreshSignal(day: string) {
    localStorage.removeItem(this.ROUTINE_STORAGE_KEY);
    this.routineCache.set(null);
    this.loadDataIfNeeded();
    return signal<Exercise[]>(this.getExercisesByDay(day));
  }

  updateExercise(day: string, exercise: Exercise): boolean {
    this.loadDataIfNeeded();
    const currentCache = this.routineCache();
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

    this.routineCache.set(updatedCache);
    localStorage.setItem(
      this.ROUTINE_STORAGE_KEY,
      JSON.stringify(updatedCache)
    );
    return true;
  }

  addExercise(day: string, exercise: Exercise): boolean {
    this.loadDataIfNeeded();
    const currentCache = this.routineCache();
    if (!currentCache) return false;

    const dayExists = currentCache.some((routine) => routine.day === day);
    let updatedCache;

    if (dayExists) {
      updatedCache = currentCache.map((routine) => {
        if (routine.day === day) {
          const maxId = Math.max(
            ...routine.list.map((ex) => parseInt(ex.id, 10)),
            0
          );
          const newExercise = { ...exercise, id: (maxId + 1).toString() };
          return { ...routine, list: [...routine.list, newExercise] };
        }
        return routine;
      });
    } else {
      const newRoutine: DayRoutine = {
        day,
        list: [{ ...exercise, id: (this.getLastExerciseId() + 1).toString() }],
      };
      updatedCache = [...currentCache, newRoutine];
    }

    this.routineCache.set(updatedCache);
    localStorage.setItem(
      this.ROUTINE_STORAGE_KEY,
      JSON.stringify(updatedCache)
    );
    return true;
  }

  deleteExercise(day: string, exerciseId: string): boolean {
    const currentCache = this.routineCache();
    if (!currentCache) return false;

    const updatedCache = currentCache.map((routine) => {
      if (routine.day === day) {
        const updatedList = routine.list.filter((ex) => ex.id !== exerciseId);
        return { ...routine, list: updatedList };
      }
      return routine;
    });

    this.routineCache.set(updatedCache);
    localStorage.setItem(
      this.ROUTINE_STORAGE_KEY,
      JSON.stringify(updatedCache)
    );
    return true;
  }

  loadDataIfNeeded(): void {
    if (!this.routineCache()) {
      this.loadRoutineCache();
    }

    if (!this.exerciseBaseCache()) {
      this.loadExerciseBaseCache();
    }
  }

  private loadRoutineCache(): void {
    const stored = localStorage.getItem(this.ROUTINE_STORAGE_KEY);
    if (stored) {
      try {
        const parsedData = JSON.parse(stored) as DayRoutine[];
        this.routineCache.set(parsedData);
        return;
      } catch (e) {
        console.error('Error al parsear rutina:', e);
        localStorage.removeItem(this.ROUTINE_STORAGE_KEY);
      }
    }

    this.httpClient
      .get<DayRoutine[]>('data/routine-details-data.json')
      .subscribe({
        next: (data) => {
          this.routineCache.set(data);
          localStorage.setItem(this.ROUTINE_STORAGE_KEY, JSON.stringify(data));
        },
        error: (err) => {
          console.error('Error cargando rutina:', err);
          this.routineCache.set([]);
        },
      });
  }

  private loadExerciseBaseCache(): void {
    const stored = localStorage.getItem(this.EXERCISE_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ExerciseBase[];
        this.exerciseBaseCache.set(parsed);
        return;
      } catch (e) {
        console.error('Error al parsear ejercicios base:', e);
        localStorage.removeItem(this.EXERCISE_STORAGE_KEY);
      }
    }

    this.httpClient.get<ExerciseBase[]>('data/exercises-data.json').subscribe({
      next: (data) => {
        this.exerciseBaseCache.set(data);
        localStorage.setItem(this.EXERCISE_STORAGE_KEY, JSON.stringify(data));
      },
      error: (err) => {
        console.error('Error cargando ejercicios base:', err);
        this.exerciseBaseCache.set([]);
      },
    });
  }
}
