
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Workout } from '@/types/workout';
import { CalendarDays } from 'lucide-react';
import { format, subMonths, subYears, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WorkoutStatsProps {
  workoutHistory: Record<string, Workout[]>;
}

const WorkoutStats: React.FC<WorkoutStatsProps> = ({ workoutHistory }) => {
  const [monthlyWorkouts, setMonthlyWorkouts] = useState(0);
  const [yearlyWorkouts, setYearlyWorkouts] = useState(0);
  
  useEffect(() => {
    const now = new Date();
    const oneMonthAgo = subMonths(now, 1);
    const oneYearAgo = subYears(now, 1);
    
    let monthCount = 0;
    let yearCount = 0;
    
    Object.values(workoutHistory).forEach(workouts => {
      workouts.forEach(workout => {
        const workoutDate = new Date(workout.date);
        
        if (isWithinInterval(workoutDate, { start: oneMonthAgo, end: now })) {
          monthCount++;
        }
        
        if (isWithinInterval(workoutDate, { start: oneYearAgo, end: now })) {
          yearCount++;
        }
      });
    });
    
    setMonthlyWorkouts(monthCount);
    setYearlyWorkouts(yearCount);
  }, [workoutHistory]);
  
  const currentMonth = format(new Date(), 'MMMM', { locale: ptBR });
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
