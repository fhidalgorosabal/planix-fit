export interface ExerciseBase {
  id: string;
  name: string;
}
export interface Exercise extends ExerciseBase {
  reps: number;
  sets: number;
  unit?: string;
  rest_time: number;
  rest_time_set: number;
}

export interface DayRoutine {
  day: string;
  list: Exercise[];
}
