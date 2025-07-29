import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DayRoutine, Exercise } from './routine-details-model';

@Injectable({
  providedIn: 'root',
})
export class RoutineDetailsApi {
  private httpClient = inject(HttpClient);

  getRoutineDetails(day: string): Observable<Exercise[] | undefined> {
    return this.httpClient
      .get<DayRoutine[]>('data/routine-details-data.json')
      .pipe(
        map(
          (data: DayRoutine[]) =>
            data.find((routine) => routine.day === day)?.list
        )
      );
  }
}
