
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Exercise } from '@/types/workout';
import { v4 as uuidv4 } from 'uuid';
import { Plus } from 'lucide-react';

interface ExerciseFormProps {
  onAddExercise: (exercise: Exercise) => void;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ onAddExercise }) => {
  const [open, setOpen] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [numSets, setNumSets] = useState(3);
  const [restTime, setRestTime] = useState(1.5);

  const resetForm = () => {
    setExerciseName('');
    setNumSets(3);
    setRestTime(1.5);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!exerciseName.trim()) return;
    
    const sets = Array.from({ length: numSets }, () => ({
      id: uuidv4(),
      reps: 0,
      weight: 0,
      completed: false,
    }));
    
    const newExercise: Exercise = {
      id: uuidv4(),
      name: exerciseName,
      sets,
      restTimeMinutes: restTime,
    };
    
    onAddExercise(newExercise);
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="workout-button w-full">
          <Plus className="mr-2 h-4 w-4" /> Adicionar Exercício
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Exercício</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="Ex: Supino Reto"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sets" className="text-right">
                Séries
              </Label>
              <Input
                id="sets"
                type="number"
                min="1"
                max="10"
                value={numSets}
                onChange={(e) => setNumSets(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rest" className="text-right">
                Descanso (min)
              </Label>
              <Input
                id="rest"
                type="number"
                min="0.5"
                max="10"
                step="0.5"
                value={restTime}
                onChange={(e) => setRestTime(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Adicionar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseForm;
