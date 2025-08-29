import { inject, Injectable, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';
import { Day } from './day-model';

@Injectable({
  providedIn: 'root',
})
export class DayApi {
  private httpClient = inject(HttpClient);
  private readonly STORAGE_KEY = 'days-cache';

  private cache = signal<Day[] | null>(null);

  private getHeaders() {
    return {
      apikey: environment.supabaseKey,
      Authorization: `Bearer ${environment.supabaseKey}`,
      'Content-Type': 'application/json',
    };
  }

  getDays() {
    this.httpClient
      .get<Day[]>(`${environment.supabaseUrl}/days`, {
        headers: this.getHeaders(),
      })
      .subscribe({
        next: (data) => {
          this.cache.set(data.sort((a, b) => a.id - b.id));
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        },
        error: (err) => {
          console.error('Error cargando los días desde base de datos:', err);
        },
      });
  }

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

    this.getDays();
  }

  toggleDayActive(dayId: number): void {
    const currentDays = this.cache();
    if (!currentDays) return;

    const dayToUpdate = currentDays.find((d) => d.id === dayId);
    if (!dayToUpdate) return;

    const updated = { ...dayToUpdate, is_active: !dayToUpdate.is_active };

    this.httpClient
      .patch(
        `${environment.supabaseUrl}/days?id=eq.${dayId}`,
        { is_active: updated.is_active },
        {
          headers: {
            ...this.getHeaders(),
            Prefer: 'return=representation',
          },
        }
      )
      .subscribe({
        next: () => {
          const updatedDays = currentDays.map((day) =>
            day.id === dayId ? updated : day
          );
          this.cache.set(updatedDays);
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedDays));
        },
        error: (err) => {
          console.error('Error actualizando día en base de datos:', err);
        },
      });
  }

  getDayName(id: number): string {
    const dayName = [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
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
