
export interface Set {
  id: string;
  reps: number;
  weight?: number;
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  restTimeMinutes: number;
  history?: ExerciseHistory[];
}

export interface ExerciseHistory {
  date: Date;
  sets: Set[];
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  date: Date;
  weekday?: string;
}

export type Weekday = 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado' | 'Domingo';
