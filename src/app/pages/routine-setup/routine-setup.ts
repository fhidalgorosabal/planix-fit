import { Component, computed, inject } from '@angular/core';
import { DayApi } from '../../api/day/day-api';

@Component({
  selector: 'app-routine-setup',
  imports: [],
  templateUrl: './routine-setup.html',
})
export class RoutineSetup {
  private dayApi = inject(DayApi);

  constructor() {
    this.dayApi.loadDataIfNeeded();
  }

  routineDays = computed(() => this.dayApi.getDaysSignal()());
}
