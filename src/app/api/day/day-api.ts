import { inject, Injectable, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Day } from './day-model';

@Injectable({
  providedIn: 'root',
})
export class DayApi {
  private httpClient = inject(HttpClient);
  private readonly STORAGE_KEY = 'days-cache';

  private cache = signal<Day[] | null>(null);

  getDaysSignal(): Signal<Day[] | null> {
    return this.cache;
  }

  loadDataIfNeeded(): void {
    if (this.cache()) return;

    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsedData = JSON.parse(stored) as Day[];
        this.cache.set(parsedData);
        return;
      } catch (e) {
        console.error('Error al parsear datos del localStorage:', e);
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }

    this.httpClient.get<Day[]>('data/routine-days-data.json').subscribe({
      next: (data) => {
        this.cache.set(data);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      },
      error: (err) => {
        console.error('Error cargando los días:', err);
        this.cache.set([]);
      },
    });
  }

  toggleDayActive(dayId: number): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return;

    let days: Day[];
    try {
      days = JSON.parse(stored) as Day[];
    } catch (e) {
      console.error('Error al parsear datos del localStorage:', e);
      return;
    }

    const updatedDays = days.map((day) =>
      day.id === dayId ? { ...day, isActive: !day.isActive } : day
    );

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedDays));
    this.cache.set(updatedDays);
  }

  getDayName(id: number): string {
    const dayName = [
      'Lunes', // 1
      'Martes', // 2
      'Miércoles', // 3
      'Jueves', // 4
      'Viernes', // 5
      'Sábado', // 6
      'Domingo', // 7
    ];

    if (id < 1 || id > 7) {
      throw new Error('El día debe estar entre 1 (Lunes) y 7 (Domingo).');
    }

    return dayName[id - 1];
  }

  refreshSignal(): Signal<Day[]> {
    localStorage.removeItem(this.STORAGE_KEY);
    this.cache.set(null);
    this.loadDataIfNeeded();
    return this.getDaysSignal() as Signal<Day[]>;
  }
}
