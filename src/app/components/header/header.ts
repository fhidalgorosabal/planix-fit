import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from '../menu/menu';

@Component({
  selector: 'app-header',
  imports: [Menu],
  templateUrl: './header.html',
})
export class Header {
  private router = inject(Router);
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toHome() {
    this.router.navigate(['home']);
  }
}
