
// Importação de React e componentes necessários
import React from 'react';
import { Exercise } from '@/types/workout';
import ExerciseComments from './ExerciseComments';

// Definição da interface de props do componente
interface ExerciseCommentsTabProps {
  exercise: Exercise;                             // Dados do exercício
  onExerciseUpdate: (exercise: Exercise) => void; // Função para atualizar o exercício
}

// Componente de wrapper para a aba de comentários em um exercício
// Este componente serve como um contêiner para o componente ExerciseComments
const ExerciseCommentsTab: React.FC<ExerciseCommentsTabProps> = ({ 
  exercise, 
  onExerciseUpdate 
}) => {
  return (
    <div className="p-4">
      {/* Renderiza o componente de comentários com as props necessárias */}
      <ExerciseComments 
        exercise={exercise} 
        onUpdateExercise={onExerciseUpdate} 
      />
    </div>
  );
};

export default ExerciseCommentsTab;
