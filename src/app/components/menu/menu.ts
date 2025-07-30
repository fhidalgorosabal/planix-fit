import {
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MenuApi } from './menu-api';
import { MenuItem } from './menu-model';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
})
export class Menu implements OnDestroy {
  private menuApi = inject(MenuApi);

  @Output() menuOpen = new EventEmitter<boolean>();

  routineDays: WritableSignal<MenuItem[]> = signal([]);

  destroy$ = new Subject<void>();

  constructor() {
    this.menuApi
      .getMenuItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.routineDays.set(data ?? []),
      });
  }

  toggleMenu() {
    setTimeout(() => {
      this.menuOpen.emit(!this.menuOpen);
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
