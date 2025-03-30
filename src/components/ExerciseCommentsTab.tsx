
import React from 'react';
import { Exercise } from '@/types/workout';
import ExerciseComments from './ExerciseComments';

interface ExerciseCommentsTabProps {
  exercise: Exercise;
  onExerciseUpdate: (exercise: Exercise) => void;
}

const ExerciseCommentsTab: React.FC<ExerciseCommentsTabProps> = ({ 
  exercise, 
  onExerciseUpdate 
}) => {
  return (
    <div className="p-4">
      <ExerciseComments 
        exercise={exercise} 
        onUpdateExercise={onExerciseUpdate} 
      />
    </div>
  );
};

export default ExerciseCommentsTab;
