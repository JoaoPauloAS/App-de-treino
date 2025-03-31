
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, SaveIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface WorkoutHeaderProps {
  date: Date;
  onSave: () => void;
  selectedDay?: string;
}

const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({ date, onSave, selectedDay }) => {
  const formattedDate = format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-primary">
          Meu Treino {selectedDay ? `- ${selectedDay}` : ''}
        </h1>
        <div className="flex items-center text-muted-foreground text-sm">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>{formattedDate}</span>
        </div>
      </div>
      <Button 
        onClick={onSave}
        className="flex items-center bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors"
      >
        <SaveIcon className="h-4 w-4 mr-1" />
        <span>Salvar</span>
      </Button>
    </div>
  );
};

export default WorkoutHeader;
