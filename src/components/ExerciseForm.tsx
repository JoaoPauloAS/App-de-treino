
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Exercise, MuscleGroup } from '@/types/workout';
import MuscleGroupSelector from './MuscleGroupSelector';

interface ExerciseFormProps {
  onAddExercise: (exercise: Exercise) => void;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ onAddExercise }) => {
  const [name, setName] = useState('');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(12);
  const [restTime, setRestTime] = useState(1);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Criar novo exercício
    const exercise: Exercise = {
      id: uuidv4(),
      name,
      restTimeMinutes: restTime,
      muscleGroups, // Incluir grupos musculares
      sets: Array(sets).fill(0).map(() => ({
        id: uuidv4(),
        reps,
        weight: 0,
        completed: false
      }))
    };
    
    // Chamar a função de callback
    onAddExercise(exercise);
    
    // Limpar o formulário
    setName('');
    setSets(3);
    setReps(12);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Exercício</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Supino Reto"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sets">Número de Séries</Label>
              <Input
                id="sets"
                type="number"
                min="1"
                value={sets}
                onChange={(e) => setSets(Number(e.target.value))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reps">Repetições por Série</Label>
              <Input
                id="reps"
                type="number"
                min="1"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rest">Tempo de Descanso (minutos)</Label>
            <Input
              id="rest"
              type="number"
              min="0.5"
              step="0.5"
              value={restTime}
              onChange={(e) => setRestTime(Number(e.target.value))}
              required
            />
          </div>
          
          <MuscleGroupSelector
            selectedGroups={muscleGroups}
            onChange={setMuscleGroups}
          />
          
          <Button type="submit" className="w-full">Adicionar Exercício</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExerciseForm;
