
import React from 'react';
import { MesoCycle, WorkoutSheet } from '@/types/workout';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Calendar, 
  FolderOpen,
  Edit, 
  Trash2, 
  CalendarRange,
  CheckCircle
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MesoCycleForm from './MesoCycleForm';

interface MesoCycleListProps {
  mesoCycles: MesoCycle[];
  workoutSheets: WorkoutSheet[];
  onUpdate: (mesoCycle: MesoCycle) => void;
  onDelete: (id: string) => void;
  onSelectWorkoutSheet: (id: string) => void;
}

const MesoCycleList: React.FC<MesoCycleListProps> = ({ 
  mesoCycles, 
  workoutSheets, 
  onUpdate, 
  onDelete,
  onSelectWorkoutSheet
}) => {
  // Função para verificar se o meso ciclo está ativo (data atual entre início e fim)
  const isMesoCycleActive = (startDate: Date, endDate: Date) => {
    const now = new Date();
    return now >= new Date(startDate) && now <= new Date(endDate);
  };

  // Função para formatar a data
  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };

  // Função para encontrar a ficha de treino pelo ID
  const findWorkoutSheet = (id: string) => {
    return workoutSheets.find(sheet => sheet.id === id);
  };

  if (mesoCycles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum meso ciclo encontrado.</p>
        <p className="text-gray-500 mt-2">Crie um novo meso ciclo para começar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {mesoCycles.map((mesoCycle) => (
        <Card key={mesoCycle.id} className={`overflow-hidden transition-all duration-300 ${isMesoCycleActive(mesoCycle.startDate, mesoCycle.endDate) ? 'border-primary/40 dark:border-primary/40 shadow-md' : ''}`}>
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span className="flex items-center">
                <FolderOpen className="h-5 w-5 mr-2 text-primary" />
                {mesoCycle.name}
              </span>
              {isMesoCycleActive(mesoCycle.startDate, mesoCycle.endDate) && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Ativo
                </span>
              )}
            </CardTitle>
            <CardDescription>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarRange className="h-3 w-3 mr-1" />
                <span>{formatDate(mesoCycle.startDate)} - {formatDate(mesoCycle.endDate)}</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mesoCycle.description && (
              <p className="text-sm text-muted-foreground mb-3 italic">
                "{mesoCycle.description}"
              </p>
            )}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="fichas" className="border-b-0">
                <AccordionTrigger className="py-2 text-sm hover:no-underline">
                  <span className="font-medium">
                    Fichas de Treino ({mesoCycle.workoutSheetIds.length})
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1 py-1">
                    {mesoCycle.workoutSheetIds.map((sheetId) => {
                      const sheet = findWorkoutSheet(sheetId);
                      if (!sheet) return null;
                      
                      return (
                        <div key={sheetId} className="flex justify-between items-center py-1 px-2 rounded hover:bg-muted/50 transition-colors">
                          <span className="text-sm flex items-center">
                            <Calendar className="h-3 w-3 mr-2" />
                            {sheet.name} {sheet.weekday ? `(${sheet.weekday})` : ''}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => onSelectWorkoutSheet(sheet.id)}
                          >
                            Usar
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 pt-2">
            <MesoCycleForm
              mesoCycle={mesoCycle}
              workoutSheets={workoutSheets}
              onSave={onUpdate}
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDelete(mesoCycle.id)}
              className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default MesoCycleList;
