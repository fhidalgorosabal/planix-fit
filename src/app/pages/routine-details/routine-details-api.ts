import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../api/environment';
import { DayRoutine, Exercise, ExerciseBase } from './routine-details-model';

@Injectable({
  providedIn: 'root',
})
export class RoutineDetailsApi {
  private readonly httpClient = inject(HttpClient);

  private readonly ROUTINE_STORAGE_KEY = 'routine-details-cache';
  private readonly EXERCISE_STORAGE_KEY = 'exercise-base-cache';

  private readonly routineCache = signal<DayRoutine[] | null>(null);
  private readonly exerciseBaseCache = signal<ExerciseBase[] | null>(null);

  private getHeaders(): Record<string, string> {
    return {
      apikey: environment.supabaseKey,
      Authorization: `Bearer ${environment.supabaseKey}`,
      'Content-Type': 'application/json',
    };
  }

  getExercisesByDay(day: string): Exercise[] {
    return this.getDayRoutine(day)?.list ?? [];
  }

  getDayRoutine(day: string): DayRoutine | undefined {
    const cache = this.routineCache();
    return day && cache ? cache.find((r) => r.day === day) : undefined;
  }

  getCachedExercisesBase(): ExerciseBase[] {
    return this.exerciseBaseCache() ?? [];
  }

  getLastExerciseId(): number {
    const allExercises =
      this.routineCache()?.flatMap((r) =>
        r.list.map((ex) => parseInt(ex.id, 10))
      ) ?? [];
    return allExercises.length ? Math.max(...allExercises) : 0;
  }

  refreshSignal(day: string): Exercise[] {
    localStorage.removeItem(this.ROUTINE_STORAGE_KEY);
    this.routineCache.set(null);
    this.loadDataIfNeeded();
    return this.getExercisesByDay(day);
  }

  updateExercise(day: string, exercise: Exercise): boolean {
    const url = `${environment.supabaseUrl}/routine_exercises?id=eq.${exercise.id}`;
    this.httpClient
      .patch(
        url,
        {
          reps: exercise.reps,
          sets: exercise.sets,
          unit: exercise.unit,
          rest_time: exercise.rest_time,
          rest_time_set: exercise.rest_time_set,
        },
        { headers: { ...this.getHeaders(), Prefer: 'return=representation' } }
      )
      .pipe(
        catchError((err) => {
          console.error('Error actualizando ejercicio:', err);
          return of(null);
        }),
        tap(() => this.loadRoutineAndExercises())
      )
      .subscribe();

    return true;
  }

  addExercise(day: string, exercise: Exercise): boolean {
    const routineId = parseInt(day, 10);
    const url = `${environment.supabaseUrl}/routine_exercises`;

    this.httpClient
      .post(
        url,
        {
          routine_id: routineId,
          exercise_id: this.getLastExerciseId() + 1,
          reps: exercise.reps,
          sets: exercise.sets,
          unit: exercise.unit,
          rest_time: exercise.rest_time,
          rest_time_set: exercise.rest_time_set,
        },
        { headers: this.getHeaders() }
      )
      .pipe(
        catchError((err) => {
          console.error('Error agregando ejercicio:', err);
          return of(null);
        }),
        tap(() => this.loadRoutineAndExercises())
      )
      .subscribe();

    return true;
  }

  deleteExercise(day: string, exerciseId: string): boolean {
    const url = `${environment.supabaseUrl}/routine_exercises?id=eq.${exerciseId}`;
    this.httpClient
      .delete(url, { headers: this.getHeaders() })
      .pipe(
        catchError((err) => {
          console.error('Error eliminando ejercicio:', err);
          return of(null);
        }),
        tap(() => this.loadRoutineAndExercises())
      )
      .subscribe();

    return true;
  }

  loadDataIfNeeded(): void {
    if (!this.routineCache() || !this.exerciseBaseCache()) {
      this.loadRoutineAndExercises();
    }
  }

  private loadRoutineAndExercises(): void {
    const routine$ = this.httpClient
      .get<any[]>(`${environment.supabaseUrl}/routine_exercises`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(() => of([])));

    const exercises$ = this.httpClient
      .get<ExerciseBase[]>(`${environment.supabaseUrl}/exercises`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(() => of([])));

    forkJoin([routine$, exercises$])
      .pipe(
        tap(([routineData, exercisesData]) => {
          this.setExerciseCache(exercisesData);
          this.setRoutineCache(this.mapRoutineData(routineData, exercisesData));
        })
      )
      .subscribe();
  }

  private setExerciseCache(exercises: ExerciseBase[]): void {
    this.exerciseBaseCache.set(exercises);
    localStorage.setItem(this.EXERCISE_STORAGE_KEY, JSON.stringify(exercises));
  }

  private setRoutineCache(routine: DayRoutine[]): void {
    const sorted = routine.sort((a, b) => parseInt(a.day) - parseInt(b.day));
    this.routineCache.set(sorted);
    localStorage.setItem(this.ROUTINE_STORAGE_KEY, JSON.stringify(sorted));
  }

  private mapRoutineData(
    routineData: any[],
    exercisesData: ExerciseBase[]
  ): DayRoutine[] {
    const mapped: DayRoutine[] = [];

    for (const item of routineData) {
      const dayStr = item.routine_id.toString();
      let dayRoutine = mapped.find((d) => d.day === dayStr);

      if (!dayRoutine) {
        dayRoutine = { day: dayStr, list: [] };
        mapped.push(dayRoutine);
      }

      const exerciseInfo = exercisesData.find(
        (ex) => ex.id === item.exercise_id
      );

      if (exerciseInfo) {
        dayRoutine.list.push({
          id: item.id.toString(),
          name: exerciseInfo.name,
          reps: item.reps,
          sets: item.sets,
          unit: item.unit,
          rest_time: item.rest_time,
          rest_time_set: item.rest_time_set,
        });
      }
    }

    return mapped;
  }
}
