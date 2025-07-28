import { Component, EventEmitter, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { RoutineDays } from '../../interface/RoutineDays';

@Component({
  selector: 'app-menu',
  imports: [NgClass],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  @Output() menuOpen = new EventEmitter<boolean>(false);

  routineDays: RoutineDays[] = [
    { id: 1, name: 'Lunes', isActive: true },
    { id: 2, name: 'Martes', isActive: true },
    { id: 3, name: 'Miércoles', isActive: true },
    { id: 4, name: 'Jueves', isActive: true },
    { id: 5, name: 'Viernes', isActive: true },
    { id: 6, name: 'Sábado', isActive: false },
    { id: 7, name: 'Domingo', isActive: false },
  ];

  toggleMenu() {
    this.menuOpen.emit(!this.menuOpen);
  }
}
