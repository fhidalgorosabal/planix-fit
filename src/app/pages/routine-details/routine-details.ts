import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoutineDetailsApi } from './routine-details-api';
import { ExerciseItem } from '../../components/exercise-item/exercise-item';
import { DayApi } from '../../api/day/day-api';
import { SoundApi } from '../../api/sound/sound-api';

@Component({
  standalone: true,
  selector: 'app-routine-details',
  imports: [ExerciseItem],
  templateUrl: './routine-details.html',
})
export class RoutineDetails implements OnDestroy {
  private route = inject(ActivatedRoute);
  private routineDetailsApi = inject(RoutineDetailsApi);
  private dayApi = inject(DayApi);
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
    return this.dayApi.getDayName(Number(this.day()));
  });

  onExerciseCompleted() {
    const nextIndex = this.currentExerciseIndex() + 1;
    if (nextIndex < this.exercises().length) {
      this.isGlobalResting.set(true);
      const rest_time_set =
        this.exercises()[this.currentExerciseIndex()].rest_time_set || 120;
      this.globalCountdown.set(rest_time_set);
      this.startGlobalrest_timer(() => {
        this.isGlobalResting.set(false);
        this.currentExerciseIndex.set(nextIndex);
        this.soundApi.play('sounds/sound-1.mp3', 3);
      });
    }
  }

  private startGlobalrest_timer(callback: () => void) {
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
