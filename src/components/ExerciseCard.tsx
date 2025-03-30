
import React, { useState } from 'react';
import { Plus, Minus, Clock, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Exercise, Set } from '@/types/workout';
import { v4 as uuidv4 } from 'uuid';
import RestTimer from './RestTimer';

interface ExerciseCardProps {
  exercise: Exercise;
  onExerciseUpdate: (updatedExercise: Exercise) => void;
  readOnly?: boolean; // Added readOnly prop
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ 
  exercise, 
  onExerciseUpdate, 
  readOnly = false // Default to false
}) => {
  const [isTimerActive, setIsTimerActive] = useState(false);

  const addSet = () => {
    if (readOnly) return; // Don't add sets in readOnly mode
    
    const newSet: Set = {
      id: uuidv4(),
      reps: 0,
      weight: 0,
      completed: false,
    };
    
    const updatedExercise = {
      ...exercise,
      sets: [...exercise.sets, newSet],
    };
    
    onExerciseUpdate(updatedExercise);
  };

  const removeSet = (setId: string) => {
    if (readOnly) return; // Don't remove sets in readOnly mode
    
    const updatedExercise = {
      ...exercise,
      sets: exercise.sets.filter(set => set.id !== setId),
    };
    
    onExerciseUpdate(updatedExercise);
  };

  const updateSet = (setId: string, field: keyof Set, value: any) => {
    if (readOnly) return; // Don't update sets in readOnly mode
    
    const updatedSets = exercise.sets.map(set => {
      if (set.id === setId) {
        return { ...set, [field]: value };
      }
      return set;
    });
    
    const updatedExercise = {
      ...exercise,
      sets: updatedSets,
    };
    
    onExerciseUpdate(updatedExercise);
  };

  const updateRestTime = (minutes: number) => {
    if (readOnly) return; // Don't update rest time in readOnly mode
    
    const updatedExercise = {
      ...exercise,
      restTimeMinutes: minutes,
    };
    
    onExerciseUpdate(updatedExercise);
  };

  const toggleTimer = () => {
    if (readOnly) return; // Don't toggle timer in readOnly mode
    setIsTimerActive(!isTimerActive);
  };

  return (
    <Card className="workout-card mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="workout-header flex justify-between items-center">
          <span>{exercise.name}</span>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={toggleTimer}
              disabled={readOnly}
            >
              <Clock className="h-4 w-4" />
              <span>{exercise.restTimeMinutes}m</span>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {isTimerActive && (
          <div className="mb-4">
            <RestTimer 
              minutes={exercise.restTimeMinutes} 
              onComplete={() => setIsTimerActive(false)} 
              onChangeTime={updateRestTime}
            />
          </div>
        )}
        
        <div className="mb-4">
          <div className="grid grid-cols-12 gap-2 font-medium text-sm text-gray-500 mb-2">
            <div className="col-span-1">Set</div>
            <div className="col-span-4">Reps</div>
            <div className="col-span-4">Peso (kg)</div>
            <div className="col-span-3">Status</div>
          </div>
          
          {exercise.sets.map((set, index) => (
            <div key={set.id} className="grid grid-cols-12 gap-2 items-center mb-2">
              <div className="col-span-1 font-medium">{index + 1}</div>
              <div className="col-span-4">
                <Input
                  type="number"
                  min="0"
                  value={set.reps || ''}
                  onChange={(e) => updateSet(set.id, 'reps', Number(e.target.value))}
                  className="h-9"
                  disabled={readOnly}
                />
              </div>
              <div className="col-span-4">
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={set.weight || ''}
                  onChange={(e) => updateSet(set.id, 'weight', Number(e.target.value))}
                  className="h-9"
                  disabled={readOnly}
                />
              </div>
              <div className="col-span-3 flex justify-start">
                <Button
                  variant={set.completed ? "default" : "outline"}
                  size="sm"
                  className={`w-9 h-9 p-0 ${set.completed ? 'bg-workout-secondary' : ''}`}
                  onClick={() => updateSet(set.id, 'completed', !set.completed)}
                  disabled={readOnly}
                >
                  {set.completed ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-9 h-9 p-0 ml-1"
                    onClick={() => removeSet(set.id)}
                  >
                    <Minus className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {!readOnly && (
          <Button 
            onClick={addSet}
            variant="outline" 
            className="w-full flex items-center justify-center gap-1"
          >
            <Plus className="h-4 w-4" /> Adicionar série
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;
