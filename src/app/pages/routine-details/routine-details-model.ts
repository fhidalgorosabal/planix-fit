export interface Exercise {
  id: string;
  name: string;
  reps: number;
  sets: number;
  unit?: string;
  restTime: number;
  restTimeSet: number;
}

export interface DayRoutine {
  day: string;
  list: Exercise[];
}
