
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Exercise, Workout } from '@/types/workout';
import ExerciseCard from '@/components/ExerciseCard';
import ExerciseForm from '@/components/ExerciseForm';
import WorkoutHeader from '@/components/WorkoutHeader';
import { v4 as uuidv4 } from 'uuid';
import { Save } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const [workout, setWorkout] = useState<Workout>({
    id: uuidv4(),
    name: 'Meu Treino',
    exercises: [],
    date: new Date(),
  });

  // Try to load workout from localStorage
  useEffect(() => {
    const savedWorkout = localStorage.getItem('currentWorkout');
    if (savedWorkout) {
      try {
        const parsedWorkout = JSON.parse(savedWorkout);
        // Convert string date back to Date object
        parsedWorkout.date = new Date(parsedWorkout.date);
        setWorkout(parsedWorkout);
      } catch (error) {
        console.error('Error parsing saved workout:', error);
      }
    }
  }, []);

  const handleAddExercise = (exercise: Exercise) => {
    setWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, exercise],
    }));
  };

  const handleUpdateExercise = (updatedExercise: Exercise) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === updatedExercise.id ? updatedExercise : ex
      ),
    }));
  };

  const handleSaveWorkout = () => {
    // Save to localStorage
    localStorage.setItem('currentWorkout', JSON.stringify(workout));
    
    toast({
      title: "Treino salvo",
      description: "Seu treino foi salvo com sucesso.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <WorkoutHeader 
        date={workout.date} 
        onSave={handleSaveWorkout} 
      />
      
      <div className="mb-6">
        {workout.exercises.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onExerciseUpdate={handleUpdateExercise}
          />
        ))}
      </div>
      
      <ExerciseForm onAddExercise={handleAddExercise} />
    </div>
  );
};

export default Index;
