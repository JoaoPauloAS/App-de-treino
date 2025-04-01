
/**
 * @file WeekdaySelector.tsx
 * @description Seletor de dias da semana para organização de treinos
 * Permite escolher um dia da semana com feedback visual
 */

import React from 'react';
import { Weekday } from '@/types/workout';
import { cn } from '@/lib/utils';

/**
 * Interface de props do componente
 * @property {Weekday | undefined} selectedDay - Dia da semana atualmente selecionado
 * @property {Function} onChange - Callback para quando a seleção mudar
 */
interface WeekdaySelectorProps {
  selectedDay: Weekday | undefined;
  onChange: (day: Weekday) => void;
}

/**
 * Componente para selecionar dias da semana
 * Exibe botões para cada dia da semana com destaque para o selecionado
 * 
 * @param {WeekdaySelectorProps} props - Propriedades do componente
 * @returns {JSX.Element} Interface para seleção de dia da semana
 */
const WeekdaySelector: React.FC<WeekdaySelectorProps> = ({ selectedDay, onChange }) => {
  // Lista de dias da semana em português
  const weekdays: Weekday[] = [
    'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {weekdays.map(day => (
        <button
          key={day}
          onClick={() => onChange(day)}
          className={cn(
            "px-3 py-1 rounded-full text-sm transition-colors",
            selectedDay === day 
              ? "bg-workout-primary text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          {day}
        </button>
      ))}
    </div>
  );
};

export default WeekdaySelector;
