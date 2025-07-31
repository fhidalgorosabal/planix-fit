import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DayApi } from '../../api/day/day-api';

@Component({
  selector: 'app-routine-setup',
  imports: [RouterLink],
  templateUrl: './routine-setup.html',
})
export class RoutineSetup {
  private dayApi = inject(DayApi);

  constructor() {
    this.dayApi.loadDataIfNeeded();
  }

  routineDays = computed(() => this.dayApi.getDaysSignal()());

  toggleDay(id: number): void {
    this.dayApi.toggleDayActive(id);
  }
}
