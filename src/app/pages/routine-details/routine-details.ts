import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoutineDetailsSerice } from './service';
import { Observable } from 'rxjs';
import { DayRoutine, Exercise } from './interface';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-routine-details',
  imports: [AsyncPipe, DatePipe],
  templateUrl: './routine-details.html',
  styleUrl: './routine-details.css',
})
export class RoutineDetails {
  private routineDetailsSerice = inject(RoutineDetailsSerice);
  private route = inject(ActivatedRoute);
  day: string = '';

  exercises$: Observable<Exercise[] | undefined> = new Observable();

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.day = params.get('day') || '1';
      this.exercises$ = this.routineDetailsSerice.getRoutineDetails(this.day);
    });
  }

  getDayDate(): Date {
    return new Date(2025, 6, parseInt(this.day, 10));
  }
}
