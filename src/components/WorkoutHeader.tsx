
/**
 * @file WorkoutHeader.tsx
 * @description Cabeçalho para a página de treino
 * Exibe o título, data atual e botão de salvar para o treino em andamento
 */

import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, SaveIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Interface que define as propriedades esperadas pelo componente
 * @property {Date} date - Data do treino a ser exibida
 * @property {Function} onSave - Função callback para salvar o treino
 * @property {string} selectedDay - Dia da semana selecionado (opcional)
 */
interface WorkoutHeaderProps {
  date: Date;
  onSave: () => void;
  selectedDay?: string;
}

/**
 * Componente de cabeçalho para a página de treino
 * Exibe o título, data e botão de salvar, com layout responsivo
 * 
 * @param {WorkoutHeaderProps} props - Propriedades do componente
 * @returns {JSX.Element} Cabeçalho para a página de treino
 */
const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({ date, onSave, selectedDay }) => {
  // Formata a data para exibição no formato local (pt-BR)
  const formattedDate = format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  // Detecta se o dispositivo está em viewport mobile para ajustes de layout
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
