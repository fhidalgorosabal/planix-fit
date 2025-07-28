export interface Exercise {
  id: string;
  name: string;
  reps: number;
  sets: number;
  unit?: string;
}

export interface DayRoutine {
  day: string;
  list: Exercise[];
}
