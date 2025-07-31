import { Component, computed, effect, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RoutineDetailsApi } from '../routine-details/routine-details-api';

@Component({
  selector: 'app-routine-details-setup',
  imports: [DatePipe],
  templateUrl: './routine-details-setup.html',
})
export class RoutineDetailsSetup {
  private route = inject(ActivatedRoute);
  private routineDetailsApi = inject(RoutineDetailsApi);

  day = signal('1');

  constructor() {
    effect(() => {
      this.route.paramMap.subscribe((params) => {
        const newDay = params.get('day') || '1';
        this.day.set(newDay);
        this.routineDetailsApi.loadDataIfNeeded();
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
}
