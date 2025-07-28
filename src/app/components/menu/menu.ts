import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { RoutineDays } from './interface';
import { MenuService } from './service';

@Component({
  selector: 'app-menu',
  imports: [AsyncPipe, NgClass, RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
})
export class Menu {
  private menuService = inject(MenuService);

  @Output() menuOpen = new EventEmitter<boolean>(false);

  routineDays$: Observable<RoutineDays[]>;

  constructor() {
    this.routineDays$ = this.menuService.getMenuItems();
  }

  toggleMenu() {
    setTimeout(() => {
      this.menuOpen.emit(!this.menuOpen);
    }, 100);
  }
}
