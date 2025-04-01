
// Importação de bibliotecas, hooks e componentes necessários
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

// Definição das props do componente
interface ExerciseCardProps {
  exercise: Exercise;                                  // Dados do exercício a ser exibido
  onExerciseUpdate: (updatedExercise: Exercise) => void; // Função para atualizar exercício
  onExerciseDelete?: (exerciseId: string) => void;     // Função opcional para excluir exercício
  readOnly?: boolean;                                 // Flag para modo somente leitura
}

// Componente principal de cartão de exercício
const ExerciseCard: React.FC<ExerciseCardProps> = ({ 
  exercise, 
  onExerciseUpdate, 
  onExerciseDelete,
  readOnly = false
}) => {
  // Estados locais do componente
  const [isTimerActive, setIsTimerActive] = useState(false);               // Controla se o timer está ativo
  const [newExerciseName, setNewExerciseName] = useState(exercise.name);   // Nome ao renomear exercício
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);     // Controla diálogo de renomeação
  const isMobile = useIsMobile();                                         // Verifica se é dispositivo móvel
  const { toast } = useToast();                                           // Hook para mostrar notificações
  
  // Inicialização do efeito sonoro para o timer
  const [timerSound] = useState(() => {
    if (typeof window !== "undefined") {
      return new Audio("/timer-complete.mp3");
    }
    return null;
  });

  // Função para adicionar uma nova série ao exercício
  const addSet = () => {
    if (readOnly) return;
    
    // Cria nova série com valores padrão
    const newSet: Set = {
      id: uuidv4(),
      reps: 0,
      weight: 0,
      completed: false,
    };
    
    // Atualiza o exercício com a nova série
    const updatedExercise = {
      ...exercise,
      sets: [...exercise.sets, newSet],
    };
    
    onExerciseUpdate(updatedExercise);
  };

  // Função para remover uma série do exercício
  const removeSet = (setId: string) => {
    if (readOnly) return;
    
    // Filtra a série a ser removida
    const updatedExercise = {
      ...exercise,
      sets: exercise.sets.filter(set => set.id !== setId),
    };
    
    onExerciseUpdate(updatedExercise);
  };

  // Função para atualizar um campo específico de uma série
  const updateSet = (setId: string, field: keyof Set, value: any) => {
    if (readOnly) return;
    
    // Mapeia as séries e atualiza o campo específico da série desejada
    const updatedSets = exercise.sets.map(set => {
      if (set.id === setId) {
        return { ...set, [field]: value };
      }
      return set;
    });
    
    // Atualiza o exercício com as séries atualizadas
    const updatedExercise = {
      ...exercise,
      sets: updatedSets,
    };
    
    onExerciseUpdate(updatedExercise);
  };

  // Função para atualizar o tempo de descanso
  const updateRestTime = (minutes: number) => {
    if (readOnly) return;
    
    // Atualiza o exercício com o novo tempo de descanso
    const updatedExercise = {
      ...exercise,
      restTimeMinutes: minutes,
    };
    
    onExerciseUpdate(updatedExercise);
  };

  // Alterna o estado do timer de descanso
  const toggleTimer = () => {
    if (readOnly) return;
    setIsTimerActive(!isTimerActive);
  };

  // Manipulador para quando o timer completa
  const handleTimerComplete = () => {
    setIsTimerActive(false);
    // Toca som quando o timer completa
    if (timerSound) {
      timerSound.volume = 0.3; // Define um volume mais baixo para um som suave
      timerSound.play().catch(error => {
        console.error("Error playing timer sound:", error);
      });
    }
  };

  // Função para renomear o exercício
  const handleRenameExercise = () => {
    if (readOnly) return;
    
    // Verifica se o nome não está vazio
    if (!newExerciseName.trim()) {
      toast({
        title: "Nome inválido",
        description: "O nome do exercício não pode estar vazio.",
        variant: "destructive"
      });
      return;
    }
    
    // Atualiza o exercício com o novo nome
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

  // Função para excluir o exercício
  const handleDeleteExercise = () => {
    if (readOnly || !onExerciseDelete) return;
    
    onExerciseDelete(exercise.id);
    
    toast({
      title: "Exercício excluído",
      description: "O exercício foi excluído com sucesso.",
    });
  };

  // Função para marcar todas as séries do exercício como concluídas
  const markExerciseAsCompleted = () => {
    if (readOnly) return;
    
    // Marca todas as séries como concluídas
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

  // Verifica se todas as séries do exercício estão concluídas
  const isExerciseCompleted = exercise.sets.length > 0 && exercise.sets.every(set => set.completed);

  // Interface do componente
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
        {/* Exibe o timer de descanso se estiver ativo */}
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
          {/* Cabeçalho da tabela de séries */}
          <div className={`grid ${isMobile ? 'grid-cols-10' : 'grid-cols-12'} gap-2 font-medium text-sm text-gray-500 mb-2`}>
            <div className={`${isMobile ? 'col-span-1' : 'col-span-1'}`}>Set</div>
            <div className={`${isMobile ? 'col-span-3' : 'col-span-4'}`}>Reps</div>
            <div className={`${isMobile ? 'col-span-3' : 'col-span-4'}`}>Peso (kg)</div>
            <div className={`${isMobile ? 'col-span-3' : 'col-span-3'}`}>Status</div>
          </div>
          
          {/* Lista de séries do exercício */}
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
        
        {/* Botões de adicionar série e concluir exercício (se não estiver em modo somente leitura) */}
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
