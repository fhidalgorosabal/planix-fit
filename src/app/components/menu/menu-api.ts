import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuItem } from './menu-model';

@Injectable({
  providedIn: 'root',
})
export class MenuApi {
  private httpClient = inject(HttpClient);
  private readonly STORAGE_KEY = 'menu-items-cache';

  private cache: MenuItem[] | null = null;
  private subject = new BehaviorSubject<MenuItem[]>([]);

  getMenuItems(): Observable<MenuItem[]> {
    if (this.cache) {
      this.subject.next(this.cache);
      return this.subject.asObservable();
    }

    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.cache = JSON.parse(stored);
      this.cache && this.subject.next(this.cache);
      return this.subject.asObservable();
    }

    this.httpClient.get<MenuItem[]>('data/routine-days-data.json').subscribe({
      next: (data) => {
        this.cache = data;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        this.subject.next(data);
      },
      error: (err) => {
        console.error('Error cargando menú:', err);
        this.subject.next([]);
      },
    });

    return this.subject.asObservable();
  }

  refresh(): Observable<MenuItem[]> {
    localStorage.removeItem(this.STORAGE_KEY);
    this.cache = null;
    return this.getMenuItems();
  }
}
