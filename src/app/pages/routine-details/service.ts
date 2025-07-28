import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoutineDetailsSerice {
  getRoutineDetails(day: string): string {
    return day;
  }
}
