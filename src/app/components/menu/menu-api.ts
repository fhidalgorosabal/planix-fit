import { inject, Injectable, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuItem } from './menu-model';

@Injectable({
  providedIn: 'root',
})
export class MenuApi {
  private httpClient = inject(HttpClient);
  private readonly STORAGE_KEY = 'menu-items-cache';

  private cache = signal<MenuItem[] | null>(null);

  getMenuItemsSignal(): Signal<MenuItem[] | null> {
    return this.cache;
  }

  loadDataIfNeeded(): void {
    if (this.cache()) return;

    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsedData = JSON.parse(stored) as MenuItem[];
        this.cache.set(parsedData);
        return;
      } catch (e) {
        console.error('Error al parsear datos del localStorage:', e);
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }

    this.httpClient.get<MenuItem[]>('data/routine-days-data.json').subscribe({
      next: (data) => {
        this.cache.set(data);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      },
      error: (err) => {
        console.error('Error cargando menú:', err);
        this.cache.set([]);
      },
    });
  }

  refreshSignal(): Signal<MenuItem[]> {
    localStorage.removeItem(this.STORAGE_KEY);
    this.cache.set(null);
    this.loadDataIfNeeded();
    return this.getMenuItemsSignal() as Signal<MenuItem[]>;
  }
}
