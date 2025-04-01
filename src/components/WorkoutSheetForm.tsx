
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { WorkoutSheet, Weekday, Exercise } from '@/types/workout';
import { v4 as uuidv4 } from 'uuid';
import { FilePlus, Plus } from 'lucide-react';
import ExerciseForm from '@/components/ExerciseForm';
import ExerciseCard from '@/components/ExerciseCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface WorkoutSheetFormProps {
  workout: WorkoutSheet | null;
  onSave: (workoutSheet: WorkoutSheet) => void;
}

const WorkoutSheetForm: React.FC<WorkoutSheetFormProps> = ({ workout, onSave }) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [name, setName] = useState(workout?.name || 'Nova Ficha de Treino');
  const [description, setDescription] = useState(workout?.description || '');
  const [weekday, setWeekday] = useState<Weekday | undefined>(workout?.weekday);
  const [isPublic, setIsPublic] = useState(workout?.isPublic || false);
  const [exercises, setExercises] = useState<Exercise[]>(workout?.exercises || []);
  const { toast } = useToast();

  const weekdays: Weekday[] = [
    'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'
  ];

  const resetForm = () => {
    setName(workout?.name || 'Nova Ficha de Treino');
    setDescription(workout?.description || '');
    setWeekday(workout?.weekday);
    setIsPublic(workout?.isPublic || false);
    setExercises(workout?.exercises || []);
    setActiveTab("details");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    const newWorkoutSheet: WorkoutSheet = {
      id: workout?.id || uuidv4(),
      name,
      description,
      weekday,
      exercises,
      isPublic,
      shareId: workout?.shareId || uuidv4(),
      createdAt: workout?.createdAt || new Date(),
    };
    
    onSave(newWorkoutSheet);
    setOpen(false);
    resetForm();
  };

  const handleAddExercise = (exercise: Exercise) => {
    setExercises([...exercises, exercise]);
    toast({
      title: "Exercício adicionado",
      description: `${exercise.name} foi adicionado à ficha de treino.`,
    });
  };

  const handleUpdateExercise = (updatedExercise: Exercise) => {
    setExercises(exercises.map(ex => 
      ex.id === updatedExercise.id ? updatedExercise : ex
    ));
  };

  const handleDeleteExercise = (exerciseId: string) => {
    setExercises(exercises.filter(ex => ex.id !== exerciseId));
    toast({
      title: "Exercício removido",
      description: "O exercício foi removido da ficha de treino.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FilePlus className="h-5 w-5" />
          {workout ? 'Editar Ficha' : 'Nova Ficha'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {workout ? 'Editar Ficha de Treino' : 'Criar Nova Ficha de Treino'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="exercises">Exercícios ({exercises.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="pt-4">
            <form id="workoutDetailsForm" onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Treino A - Peito e Tríceps"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Descrição
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descrição do treino..."
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="weekday" className="text-right">
                    Dia da Semana
                  </Label>
                  <select
                    id="weekday"
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={weekday || ''}
                    onChange={(e) => setWeekday(e.target.value as Weekday)}
                  >
                    <option value="">Selecionar dia</option>
                    {weekdays.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="isPublic" className="text-right">
                    Compartilhar
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <label htmlFor="isPublic">Tornar público para compartilhar</label>
                  </div>
                </div>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="exercises" className="pt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Exercícios na Ficha</h3>
              {exercises.length === 0 ? (
                <p className="text-muted-foreground">Nenhum exercício adicionado ainda.</p>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {exercises.map(exercise => (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      onExerciseUpdate={handleUpdateExercise}
                      onExerciseDelete={handleDeleteExercise}
                    />
                  ))}
                </div>
              )}
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Adicionar Novo Exercício</h3>
                <ExerciseForm onAddExercise={handleAddExercise} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4">
          <Button type="submit" form="workoutDetailsForm">
            {workout ? 'Salvar Alterações' : 'Criar Ficha'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutSheetForm;
