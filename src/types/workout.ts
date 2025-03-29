
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
  muscleGroups?: MuscleGroup[]; // Adicionado grupos musculares
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
  description?: string;
  isPublic?: boolean;
  shareId?: string;
}

export type Weekday = 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado' | 'Domingo';

// Tipo para grupos musculares atualizado
export type MuscleGroup = 
  | 'Peito'
  | 'Costas'
  | 'Quadríceps'
  | 'Posterior'
  | 'Ombros'
  | 'Bíceps'
  | 'Tríceps'
  | 'Abdômen'
  | 'Glúteos'
  | 'Panturrilha'
  | 'Antebraço'
  | 'Trapézio'
  | 'Lombar';

// Interface para workout sheets
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
