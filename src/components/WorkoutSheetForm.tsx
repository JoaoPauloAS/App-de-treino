
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
import { WorkoutSheet, Weekday } from '@/types/workout';
import { v4 as uuidv4 } from 'uuid';
import { FilePlus } from 'lucide-react';

interface WorkoutSheetFormProps {
  workout: WorkoutSheet | null;
  onSave: (workoutSheet: WorkoutSheet) => void;
}

const WorkoutSheetForm: React.FC<WorkoutSheetFormProps> = ({ workout, onSave }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(workout?.name || 'Nova Ficha de Treino');
  const [description, setDescription] = useState(workout?.description || '');
  const [weekday, setWeekday] = useState<Weekday | undefined>(workout?.weekday);
  const [isPublic, setIsPublic] = useState(workout?.isPublic || false);

  const weekdays: Weekday[] = [
    'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'
  ];

  const resetForm = () => {
    setName(workout?.name || 'Nova Ficha de Treino');
    setDescription(workout?.description || '');
    setWeekday(workout?.weekday);
    setIsPublic(workout?.isPublic || false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    const newWorkoutSheet: WorkoutSheet = {
      id: workout?.id || uuidv4(),
      name,
      description,
      weekday,
      exercises: workout?.exercises || [],
      isPublic,
      shareId: workout?.shareId || uuidv4(),
      createdAt: workout?.createdAt || new Date(),
    };
    
    onSave(newWorkoutSheet);
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FilePlus className="h-5 w-5" />
          {workout ? 'Editar Ficha' : 'Nova Ficha'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {workout ? 'Editar Ficha de Treino' : 'Criar Nova Ficha de Treino'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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
          <DialogFooter>
            <Button type="submit">
              {workout ? 'Salvar Alterações' : 'Criar Ficha'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutSheetForm;
