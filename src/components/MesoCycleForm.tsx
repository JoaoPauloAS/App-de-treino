
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { WorkoutSheet, MesoCycle } from '@/types/workout';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, FolderPlus, Edit } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from "@/lib/utils";
import { useAuth } from '@/context/AuthContext';

interface MesoCycleFormProps {
  mesoCycle: MesoCycle | null;
  workoutSheets: WorkoutSheet[];
  onSave: (mesoCycle: MesoCycle) => void;
}

const MesoCycleForm: React.FC<MesoCycleFormProps> = ({ 
  mesoCycle, 
  workoutSheets, 
  onSave 
}) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(mesoCycle?.name || 'Novo Meso Ciclo');
  const [description, setDescription] = useState(mesoCycle?.description || '');
  const [startDate, setStartDate] = useState<Date>(mesoCycle?.startDate || new Date());
  const [endDate, setEndDate] = useState<Date>(mesoCycle?.endDate || new Date(new Date().setMonth(new Date().getMonth() + 1)));
  const [selectedWorkoutSheets, setSelectedWorkoutSheets] = useState<string[]>(mesoCycle?.workoutSheetIds || []);

  const resetForm = () => {
    setName(mesoCycle?.name || 'Novo Meso Ciclo');
    setDescription(mesoCycle?.description || '');
    setStartDate(mesoCycle?.startDate || new Date());
    setEndDate(mesoCycle?.endDate || new Date(new Date().setMonth(new Date().getMonth() + 1)));
    setSelectedWorkoutSheets(mesoCycle?.workoutSheetIds || []);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    const newMesoCycle: MesoCycle = {
      id: mesoCycle?.id || uuidv4(),
      name,
      description,
      startDate,
      endDate,
      workoutSheetIds: selectedWorkoutSheets,
      createdAt: mesoCycle?.createdAt || new Date(),
      createdBy: user?.id
    };
    
    onSave(newMesoCycle);
    setOpen(false);
    resetForm();
  };

  const handleWorkoutSheetToggle = (id: string) => {
    setSelectedWorkoutSheets((prev) => {
      if (prev.includes(id)) {
        return prev.filter(sheetId => sheetId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          {mesoCycle ? <Edit className="h-5 w-5" /> : <FolderPlus className="h-5 w-5" />}
          {mesoCycle ? 'Editar Meso Ciclo' : 'Novo Meso Ciclo'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {mesoCycle ? 'Editar Meso Ciclo' : 'Criar Novo Meso Ciclo'}
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
                placeholder="Ex: Meso Ciclo de Hipertrofia"
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
                placeholder="Descrição do meso ciclo..."
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Data Início
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd/MM/yyyy") : <span>Selecione a data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Data Fim
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd/MM/yyyy") : <span>Selecione a data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Label className="text-right">
                Fichas de Treino
              </Label>
              <div className="col-span-3 space-y-2">
                {workoutSheets.length > 0 ? (
                  workoutSheets.map((sheet) => (
                    <div key={sheet.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`sheet-${sheet.id}`} 
                        checked={selectedWorkoutSheets.includes(sheet.id)}
                        onCheckedChange={() => handleWorkoutSheetToggle(sheet.id)}
                      />
                      <label 
                        htmlFor={`sheet-${sheet.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {sheet.name} {sheet.weekday ? `(${sheet.weekday})` : ''}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma ficha de treino disponível. Crie fichas primeiro.
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={selectedWorkoutSheets.length === 0}>
              {mesoCycle ? 'Salvar Alterações' : 'Criar Meso Ciclo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MesoCycleForm;
