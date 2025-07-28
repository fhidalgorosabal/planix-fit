import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  @Output() menuOpen = new EventEmitter<boolean>(false);

  toggleMenu() {
    this.menuOpen.emit(!this.menuOpen);
  }
}
