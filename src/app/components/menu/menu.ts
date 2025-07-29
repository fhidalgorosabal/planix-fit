import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuApi } from './menu-api';
import { RoutineDays } from './menu-model';

@Component({
  selector: 'app-menu',
  imports: [AsyncPipe, NgClass, RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
})
export class Menu {
  private menuApi = inject(MenuApi);

  @Output() menuOpen = new EventEmitter<boolean>(false);

  routineDays$: Observable<RoutineDays[]>;

  constructor() {
    this.routineDays$ = this.menuApi.getMenuItems();
  }

  toggleMenu() {
    setTimeout(() => {
      this.menuOpen.emit(!this.menuOpen);
    }, 100);
  }
}
