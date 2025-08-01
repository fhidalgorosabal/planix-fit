import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DayApi } from '../../api/day/day-api';

@Component({
  imports: [],
  templateUrl: './home.html',
})
export class Home {
  private dayApi = inject(DayApi);
  private router = inject(Router);

  todayNumber() {
    return new Date().getDay();
  }

  getTodayName(): string {
    return this.dayApi.getDayName(this.todayNumber());
  }

  toRoutine() {
    this.router.navigate(['/routine-details', this.todayNumber()]);
  }
}
