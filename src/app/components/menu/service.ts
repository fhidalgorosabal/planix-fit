import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoutineDays } from './interface';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private httpClient = inject(HttpClient);

  getMenuItems(): Observable<RoutineDays[]> {
    return this.httpClient.get<RoutineDays[]>('data/routine-days-data.json');
  }
}
