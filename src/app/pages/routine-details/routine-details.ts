import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  signal,
  WritableSignal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RoutineDetailsApi } from './routine-details-api';
import { ExerciseItem } from '../../components/exercise-item/exercise-item';
import { Exercise } from './routine-details-model';

@Component({
  standalone: true,
  selector: 'app-routine-details',
  imports: [DatePipe, ExerciseItem],
  templateUrl: './routine-details.html',
})
export class RoutineDetails implements OnDestroy {
  private route = inject(ActivatedRoute);
  private routineDetailsApi = inject(RoutineDetailsApi);

  day = signal('1');
  exercises: WritableSignal<Exercise[]> = signal([]);

  currentExerciseIndex = signal(0);
  isGlobalResting = signal(false);
  globalCountdown = signal(10);
  private intervalId: any;

  destroy$ = new Subject<void>();

  constructor() {
    effect(() => {
      const dayValue = this.day();
      this.routineDetailsApi
        .getRoutineDetails(dayValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => this.exercises.set(data ?? []),
        });

      this.route.paramMap.subscribe((params) => {
        this.day.set(params.get('day') || '1');
      });
    });
  }

  dayDate = computed(() => {
    const today = new Date();
    return new Date(
      today.getFullYear(),
      today.getMonth(),
      parseInt(this.day(), 10) - 1
    );
  });

  onExerciseCompleted() {
    const nextIndex = this.currentExerciseIndex() + 1;
    if (nextIndex < this.exercises().length) {
      this.isGlobalResting.set(true);
      const restTimeSet =
        this.exercises()[this.currentExerciseIndex()].restTimeSet || 120;
      this.globalCountdown.set(restTimeSet);
      this.startGlobalRestTimer(() => {
        this.isGlobalResting.set(false);
        this.currentExerciseIndex.set(nextIndex);
      });
    }
  }

  private startGlobalRestTimer(callback: () => void) {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      this.globalCountdown.update((n) => n - 1);
      if (this.globalCountdown() <= 0) {
        clearInterval(this.intervalId);
        callback();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
