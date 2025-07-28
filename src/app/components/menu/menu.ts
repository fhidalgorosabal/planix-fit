import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { Observable } from 'rxjs';
import { RoutineDays } from '../../interface/routine-days';
import { MenuService } from '../../services/menu/menu';

@Component({
  selector: 'app-menu',
  imports: [AsyncPipe, NgClass],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  private menuService = inject(MenuService);

  @Output() menuOpen = new EventEmitter<boolean>(false);

  routineDays$: Observable<RoutineDays[]>;

  constructor() {
    this.routineDays$ = this.menuService.getMenuItems();
  }

  toggleMenu() {
    this.menuOpen.emit(!this.menuOpen);
  }
}
