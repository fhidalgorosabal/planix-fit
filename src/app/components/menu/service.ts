import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoutineDays } from './interface';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor(private httpClient: HttpClient) {}

  getMenuItems(): Observable<RoutineDays[]> {
    return this.httpClient.get<RoutineDays[]>('data/routine-days-data.json');
  }
}
