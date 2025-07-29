import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RoutineDetailsApi } from './routine-details-api';
import { Observable } from 'rxjs';
import { Exercise } from './routine-details-model';

@Component({
  imports: [AsyncPipe, DatePipe],
  templateUrl: './routine-details.html',
})
export class RoutineDetails {
  private routineDetailsApi = inject(RoutineDetailsApi);
  private route = inject(ActivatedRoute);
  day: string = '';

  exercises$: Observable<Exercise[] | undefined> = new Observable();

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.day = params.get('day') || '1';
      this.exercises$ = this.routineDetailsApi.getRoutineDetails(this.day);
    });
  }

  getDayDate(): Date {
    const today = new Date();
    return new Date(
      today.getFullYear(),
      today.getMonth(),
      parseInt(this.day, 10) - 1
    );
  }
}
