
import React from 'react';
import { Weekday } from '@/types/workout';
import { cn } from '@/lib/utils';

interface WeekdaySelectorProps {
  selectedDay: Weekday | undefined;
  onChange: (day: Weekday) => void;
}

const WeekdaySelector: React.FC<WeekdaySelectorProps> = ({ selectedDay, onChange }) => {
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
