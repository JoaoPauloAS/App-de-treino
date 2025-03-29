
import React from 'react';
import { WorkoutSheet, Workout } from '@/types/workout';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import WorkoutSheetForm from '@/components/WorkoutSheetForm';
import ShareWorkoutSheet from '@/components/ShareWorkoutSheet';
import { CalendarIcon, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WorkoutSheetListProps {
  workoutSheets: WorkoutSheet[];
  onSelect: (workoutSheet: WorkoutSheet) => void;
  onUpdate: (workoutSheet: WorkoutSheet) => void;
  onDelete: (id: string) => void;
}

const WorkoutSheetList: React.FC<WorkoutSheetListProps> = ({ 
  workoutSheets, 
  onSelect, 
  onUpdate, 
  onDelete 
}) => {
  if (workoutSheets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhuma ficha de treino encontrada.</p>
        <p className="text-gray-500 mt-2">Crie uma nova ficha para começar.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {workoutSheets.map((sheet) => (
        <Card key={sheet.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              {sheet.name}
              {sheet.isPublic && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Compartilhado
                </span>
              )}
            </CardTitle>
            <CardDescription>
              {sheet.weekday && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  <span>{sheet.weekday}</span>
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {sheet.description || 'Sem descrição'}
            </p>
            <p className="text-sm font-medium mt-2">
              {sheet.exercises.length} exercícios
            </p>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onSelect(sheet)}
              >
                Usar
              </Button>
              <WorkoutSheetForm 
                workout={sheet} 
                onSave={onUpdate} 
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onDelete(sheet.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <ShareWorkoutSheet workoutSheet={sheet} />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default WorkoutSheetList;
