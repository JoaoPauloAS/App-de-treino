
/**
 * @file WorkoutSheetList.tsx
 * @description Lista de fichas de treino com opções de gerenciamento
 * Exibe, seleciona, edita e exclui fichas de treino
 */

import React from 'react';
import { WorkoutSheet } from '@/types/workout';
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
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Interface de props do componente
 * @property {WorkoutSheet[]} workoutSheets - Array de fichas de treino a exibir
 * @property {Function} onSelect - Callback para quando uma ficha for selecionada
 * @property {Function} onUpdate - Callback para atualizar uma ficha
 * @property {Function} onDelete - Callback para excluir uma ficha
 */
interface WorkoutSheetListProps {
  workoutSheets: WorkoutSheet[];
  onSelect: (workoutSheet: WorkoutSheet) => void;
  onUpdate: (workoutSheet: WorkoutSheet) => void;
  onDelete: (id: string) => void;
}

/**
 * Componente para listar e gerenciar fichas de treino
 * Exibe cards para cada ficha com opções de uso, edição e exclusão
 * 
 * @param {WorkoutSheetListProps} props - Propriedades do componente
 * @returns {JSX.Element} Lista de fichas de treino
 */
const WorkoutSheetList: React.FC<WorkoutSheetListProps> = ({ 
  workoutSheets, 
  onSelect, 
  onUpdate, 
  onDelete 
}) => {
  // Detecta se o dispositivo está em viewport mobile para ajustes de layout
  const isMobile = useIsMobile();

  // Se não houver fichas, exibe mensagem informativa
  if (workoutSheets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhuma ficha de treino encontrada.</p>
        <p className="text-muted-foreground mt-2">Crie uma nova ficha para começar.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {workoutSheets.map((sheet) => (
        <Card key={sheet.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span className="truncate">{sheet.name}</span>
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
            <div className="text-sm text-muted-foreground line-clamp-2">
              {sheet.description || 'Sem descrição'}
            </div>
            <p className="text-sm font-medium mt-2">
              {sheet.exercises.length} exercícios
            </p>
          </CardContent>
          <CardFooter className={`flex ${isMobile ? 'flex-col gap-2 items-stretch' : 'justify-between'} pt-2`}>
            <div className={`flex ${isMobile ? 'w-full justify-between' : 'gap-2'}`}>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onSelect(sheet)}
                className={isMobile ? 'flex-1' : ''}
              >
                Usar
              </Button>
              <div className={isMobile ? 'flex gap-2' : ''}>
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
            </div>
            {isMobile && (
              <ShareWorkoutSheet workoutSheet={sheet} />
            )}
            {!isMobile && (
              <ShareWorkoutSheet workoutSheet={sheet} />
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default WorkoutSheetList;
