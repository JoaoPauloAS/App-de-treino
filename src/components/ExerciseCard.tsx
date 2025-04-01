
import React, { useState, useEffect } from 'react';
import { Plus, Minus, Clock, Check, X, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Exercise, Set } from '@/types/workout';
import { v4 as uuidv4 } from 'uuid';
import RestTimer from './RestTimer';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ExerciseCardProps {
  exercise: Exercise;
  onExerciseUpdate: (updatedExercise: Exercise) => void;
  onExerciseDelete?: (exerciseId: string) => void;
  readOnly?: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ 
  exercise, 
  onExerciseUpdate, 
  onExerciseDelete,
  readOnly = false
}) => {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState(exercise.name);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Sound effect for timer completion
  const [timerSound] = useState(() => {
    if (typeof window !== "undefined") {
      return new Audio("/timer-complete.mp3");
    }
    return null;
  });

  const addSet = () => {
    if (readOnly) return;
    
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
    if (readOnly) return;
    
    const updatedExercise = {
      ...exercise,
      sets: exercise.sets.filter(set => set.id !== setId),
    };
    
    onExerciseUpdate(updatedExercise);
  };

  const updateSet = (setId: string, field: keyof Set, value: any) => {
    if (readOnly) return;
    
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
    if (readOnly) return;
    
    const updatedExercise = {
      ...exercise,
      restTimeMinutes: minutes,
    };
    
    onExerciseUpdate(updatedExercise);
  };

  const toggleTimer = () => {
    if (readOnly) return;
    setIsTimerActive(!isTimerActive);
  };

  const handleTimerComplete = () => {
    setIsTimerActive(false);
    // Play sound when timer completes
    if (timerSound) {
      timerSound.volume = 0.3; // Set a lower volume for a gentle sound
      timerSound.play().catch(error => {
        console.error("Error playing timer sound:", error);
      });
    }
  };

  const handleRenameExercise = () => {
    if (readOnly) return;
    
    if (!newExerciseName.trim()) {
      toast({
        title: "Nome inválido",
        description: "O nome do exercício não pode estar vazio.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedExercise = {
      ...exercise,
      name: newExerciseName,
    };
    
    onExerciseUpdate(updatedExercise);
    setIsRenameDialogOpen(false);
    
    toast({
      title: "Exercício renomeado",
      description: `O exercício foi renomeado para "${newExerciseName}".`,
    });
  };

  const handleDeleteExercise = () => {
    if (readOnly || !onExerciseDelete) return;
    
    onExerciseDelete(exercise.id);
    
    toast({
      title: "Exercício excluído",
      description: "O exercício foi excluído com sucesso.",
    });
  };

  const markExerciseAsCompleted = () => {
    if (readOnly) return;
    
    // Mark all sets as completed
    const updatedSets = exercise.sets.map(set => ({
      ...set,
      completed: true
    }));
    
    const updatedExercise = {
      ...exercise,
      sets: updatedSets,
    };
    
    onExerciseUpdate(updatedExercise);
  };

  const isExerciseCompleted = exercise.sets.length > 0 && exercise.sets.every(set => set.completed);

  return (
    <Card className="workout-card mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="workout-header flex justify-between items-center">
          <span className="flex items-center gap-2">
            {exercise.name}
            {isExerciseCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
          </span>
          <div className="flex items-center space-x-2">
            {!readOnly && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <span className="sr-only">Opções</span>
                    <Edit className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Renomear</span>
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Renomear Exercício</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Input
                            id="name"
                            value={newExerciseName}
                            onChange={(e) => setNewExerciseName(e.target.value)}
                            className="col-span-4"
                            placeholder="Nome do exercício"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" onClick={handleRenameExercise}>Salvar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <DropdownMenuItem onClick={handleDeleteExercise} className="text-red-500">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Excluir</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
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
            {!readOnly && !isExerciseCompleted && (
              <Button
                variant="outline"
                size="sm"
                onClick={markExerciseAsCompleted}
                className="text-green-500 hover:text-green-700 hidden sm:flex"
              >
                <CheckCircle className="h-4 w-4" />
                <span className="ml-1">Concluir</span>
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {isTimerActive && (
          <div className="mb-4">
            <RestTimer 
              minutes={exercise.restTimeMinutes} 
              onComplete={handleTimerComplete} 
              onChangeTime={updateRestTime}
            />
          </div>
        )}
        
        <div className="mb-4">
          <div className={`grid ${isMobile ? 'grid-cols-10' : 'grid-cols-12'} gap-2 font-medium text-sm text-gray-500 mb-2`}>
            <div className={`${isMobile ? 'col-span-1' : 'col-span-1'}`}>Set</div>
            <div className={`${isMobile ? 'col-span-3' : 'col-span-4'}`}>Reps</div>
            <div className={`${isMobile ? 'col-span-3' : 'col-span-4'}`}>Peso (kg)</div>
            <div className={`${isMobile ? 'col-span-3' : 'col-span-3'}`}>Status</div>
          </div>
          
          {exercise.sets.map((set, index) => (
            <div key={set.id} className={`grid ${isMobile ? 'grid-cols-10' : 'grid-cols-12'} gap-2 items-center mb-2`}>
              <div className={`${isMobile ? 'col-span-1' : 'col-span-1'} font-medium`}>{index + 1}</div>
              <div className={`${isMobile ? 'col-span-3' : 'col-span-4'}`}>
                <Input
                  type="number"
                  min="0"
                  value={set.reps || ''}
                  onChange={(e) => updateSet(set.id, 'reps', Number(e.target.value))}
                  className="h-9"
                  disabled={readOnly}
                />
              </div>
              <div className={`${isMobile ? 'col-span-3' : 'col-span-4'}`}>
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
              <div className={`${isMobile ? 'col-span-3' : 'col-span-3'} flex justify-start`}>
                <Button
                  variant={set.completed ? "default" : "outline"}
                  size="sm"
                  className={`w-9 h-9 p-0 ${set.completed ? 'bg-green-500' : ''}`}
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
          <div>
            <Button 
              onClick={addSet}
              variant="outline" 
              className="w-full flex items-center justify-center gap-1 mb-2"
            >
              <Plus className="h-4 w-4" /> Adicionar série
            </Button>
            
            {!isExerciseCompleted && (
              <Button
                variant="outline"
                className="w-full text-green-500 hover:text-green-700 sm:hidden"
                onClick={markExerciseAsCompleted}
              >
                <CheckCircle className="h-4 w-4 mr-2" /> Concluir
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;
