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
import { Exercise } from './routine-details-model';

@Component({
  standalone: true,
  selector: 'app-routine-details',
  imports: [DatePipe],
  templateUrl: './routine-details.html',
})
export class RoutineDetails implements OnDestroy {
  private route = inject(ActivatedRoute);
  private routineDetailsApi = inject(RoutineDetailsApi);

  day = signal('1');

  exercises: WritableSignal<Exercise[]> = signal([]);

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
