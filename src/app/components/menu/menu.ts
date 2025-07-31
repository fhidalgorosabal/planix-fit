import {
  Component,
  EventEmitter,
  inject,
  Output,
  computed,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuApi } from './menu-api';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
})
export class Menu {
  private menuApi = inject(MenuApi);

  @Output() menuOpen = new EventEmitter<boolean>();

  constructor() {
    this.menuApi.loadDataIfNeeded();
  }

  routineDays = computed(() => this.menuApi.getMenuItemsSignal()());

  toggleMenu() {
    setTimeout(() => {
      this.menuOpen.emit(!this.menuOpen);
    }, 100);
  }
}
