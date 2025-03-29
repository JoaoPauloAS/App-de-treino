
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
  description?: string; // Added for workout sheet description
  isPublic?: boolean; // Added for sharing functionality
  shareId?: string; // Added for sharing functionality
}

export type Weekday = 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado' | 'Domingo';

// New interface for workout sheets
export interface WorkoutSheet {
  id: string;
  name: string;
  description?: string;
  weekday?: Weekday;
  exercises: Exercise[];
  isPublic: boolean;
  shareId?: string;
  createdAt: Date;
}
