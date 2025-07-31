import {
  Component,
  EventEmitter,
  inject,
  Output,
  computed,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DayApi } from '../../api/day/day-api';
import { IconComponent } from '../icons/icons';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './menu.html',
})
export class Menu {
  private dayApi = inject(DayApi);

  @Output() menuOpen = new EventEmitter<boolean>();

  constructor() {
    this.dayApi.loadDataIfNeeded();
  }

  routineDays = computed(() => this.dayApi.getDaysSignal()());

  toggleMenu() {
    setTimeout(() => {
      this.menuOpen.emit(!this.menuOpen);
    }, 100);
  }
}
