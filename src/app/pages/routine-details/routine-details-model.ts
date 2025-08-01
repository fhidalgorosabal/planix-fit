export interface ExerciseBase {
  id: string;
  name: string;
}
export interface Exercise extends ExerciseBase {
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
