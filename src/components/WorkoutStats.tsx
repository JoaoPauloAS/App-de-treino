
/**
 * @file WorkoutStats.tsx
 * @description Componente para exibir estatísticas de treinos realizados
 * Mostra contagens de treinos para diferentes períodos de tempo
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Workout } from '@/types/workout';
import { CalendarDays } from 'lucide-react';
import { format, subMonths, subYears, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Interface de props do componente
 * @property {Record<string, Workout[]>} workoutHistory - Histórico de treinos organizado por data
 */
interface WorkoutStatsProps {
  workoutHistory: Record<string, Workout[]>;
}

/**
 * Componente para exibir estatísticas de treinos
 * Calcula e mostra número de treinos por mês e por ano
 * 
 * @param {WorkoutStatsProps} props - Propriedades do componente
 * @returns {JSX.Element} Cards com estatísticas de treinos
 */
const WorkoutStats: React.FC<WorkoutStatsProps> = ({ workoutHistory }) => {
  // Estados para armazenar os contadores de treinos
  const [monthlyWorkouts, setMonthlyWorkouts] = useState(0);
  const [yearlyWorkouts, setYearlyWorkouts] = useState(0);
  
  /**
   * Efeito para calcular estatísticas dos treinos
   * Conta treinos dos últimos 30 dias e último ano
   */
  useEffect(() => {
    const now = new Date();
    const oneMonthAgo = subMonths(now, 1);
    const oneYearAgo = subYears(now, 1);
    
    let monthCount = 0;
    let yearCount = 0;
    
    // Itera sobre o histórico de treinos para contar por período
    Object.values(workoutHistory).forEach(workouts => {
      workouts.forEach(workout => {
        const workoutDate = new Date(workout.date);
        
        // Verifica se está dentro do intervalo do último mês
        if (isWithinInterval(workoutDate, { start: oneMonthAgo, end: now })) {
          monthCount++;
        }
        
        // Verifica se está dentro do intervalo do último ano
        if (isWithinInterval(workoutDate, { start: oneYearAgo, end: now })) {
          yearCount++;
        }
      });
    });
    
    // Atualiza os estados com as contagens
    setMonthlyWorkouts(monthCount);
    setYearlyWorkouts(yearCount);
  }, [workoutHistory]);
  
  // Obtém o nome do mês atual e o ano para exibição
  const currentMonth = format(new Date(), 'MMMM', { locale: ptBR });
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Card de estatísticas do mês */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-lg font-medium">Treinos este mês</CardTitle>
            <CardDescription>
              {currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)}
            </CardDescription>
          </div>
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{monthlyWorkouts}</div>
        </CardContent>
      </Card>
      
      {/* Card de estatísticas do ano */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-lg font-medium">Treinos este ano</CardTitle>
            <CardDescription>{currentYear}</CardDescription>
          </div>
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{yearlyWorkouts}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutStats;
