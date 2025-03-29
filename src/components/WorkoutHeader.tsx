
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, SaveIcon } from 'lucide-react';

interface WorkoutHeaderProps {
  date: Date;
  onSave: () => void;
  selectedDay?: string;
}

const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({ date, onSave, selectedDay }) => {
  const formattedDate = format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-workout-primary">
          Meu Treino {selectedDay ? `- ${selectedDay}` : ''}
        </h1>
        <div className="flex items-center text-gray-500">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>{formattedDate}</span>
        </div>
      </div>
      <button 
        onClick={onSave}
        className="flex items-center bg-workout-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
      >
        <SaveIcon className="h-4 w-4 mr-1" />
        <span>Salvar</span>
      </button>
    </div>
  );
};

export default WorkoutHeader;
