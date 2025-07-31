import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RoutineDetailsApi } from './routine-details-api';
import { SoundApi } from '../../api/sound/sound-api';
import { ExerciseItem } from '../../components/exercise-item/exercise-item';

@Component({
  standalone: true,
  selector: 'app-routine-details',
  imports: [DatePipe, ExerciseItem],
  templateUrl: './routine-details.html',
})
export class RoutineDetails implements OnDestroy {
  private route = inject(ActivatedRoute);
  private routineDetailsApi = inject(RoutineDetailsApi);
  private soundApi = inject(SoundApi);

  day = signal('1');
  currentExerciseIndex = signal(0);
  isGlobalResting = signal(false);
  globalCountdown = signal(10);
  private intervalId: any;

  constructor() {
    effect(() => {
      this.route.paramMap.subscribe((params) => {
        const newDay = params.get('day') || '1';
        this.day.set(newDay);
        this.routineDetailsApi.loadDataIfNeeded();
      });
    });
  }

  exercises = computed(() =>
    this.routineDetailsApi.getExercisesByDay(this.day())
  );

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
        this.soundApi.play('sounds/sound-1.mp3', 3);
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
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
