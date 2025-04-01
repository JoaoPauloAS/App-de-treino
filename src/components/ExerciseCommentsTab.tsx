
/**
 * @file ExerciseCommentsTab.tsx
 * @description Componente que encapsula a funcionalidade de comentários para exercícios.
 * Serve como um contêiner para o componente ExerciseComments, passando as props necessárias.
 */

// Importação de React e componentes necessários
import React from 'react';
import { Exercise } from '@/types/workout'; // Importa o tipo Exercise do modelo de dados
import ExerciseComments from './ExerciseComments'; // Importa o componente de exibição de comentários

/**
 * Interface que define as propriedades esperadas pelo componente
 * @property {Exercise} exercise - O objeto de exercício que contém os dados, incluindo comentários
 * @property {Function} onExerciseUpdate - Função callback para atualizar o exercício quando comentários são adicionados/editados
 */
interface ExerciseCommentsTabProps {
  exercise: Exercise;                             // Dados do exercício
  onExerciseUpdate: (exercise: Exercise) => void; // Função para atualizar o exercício
}

/**
 * Componente de wrapper para a aba de comentários em um exercício
 * Este componente serve como um contêiner para o componente ExerciseComments,
 * repassando as propriedades necessárias e mantendo a separação de responsabilidades.
 * 
 * @param {ExerciseCommentsTabProps} props - Propriedades do componente
 * @returns {JSX.Element} Um elemento React que renderiza a interface de comentários
 */
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
