
export interface Set {
  id: string;
  reps: number;
  weight?: number;
  completed: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: Date;
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  restTimeMinutes: number;
  history?: ExerciseHistory[];
  muscleGroups?: MuscleGroup[];
  comments?: Comment[]; // Adicionado comentários
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
  createdBy?: string; // ID do usuário que criou
  sharedWith?: string[]; // Lista de IDs de usuários com quem foi compartilhado
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
  createdBy?: string; // ID do usuário que criou
  sharedWith?: string[]; // Lista de IDs de usuários com quem foi compartilhado
}

// Nova interface para medições corporais
export interface BodyMeasurement {
  id: string;
  date: Date;
  weight?: number; // peso em kg
  height?: number; // altura em cm
  chest?: number; // peitoral em cm
  waist?: number; // cintura em cm
  hips?: number; // quadril em cm
  bicepsLeft?: number; // bíceps esquerdo em cm
  bicepsRight?: number; // bíceps direito em cm
  thighLeft?: number; // coxa esquerda em cm
  thighRight?: number; // coxa direita em cm
  calfLeft?: number; // panturrilha esquerda em cm
  calfRight?: number; // panturrilha direita em cm
  notes?: string; // anotações adicionais
}

// Interface para o usuário
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  workouts?: Workout[];
  workoutSheets?: WorkoutSheet[];
  savedWorkouts?: string[]; // IDs de treinos salvos
  bodyMeasurements?: BodyMeasurement[];
}
