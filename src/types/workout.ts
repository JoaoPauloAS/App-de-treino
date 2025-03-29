
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
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  date: Date;
}
