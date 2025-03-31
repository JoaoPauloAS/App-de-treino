
import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Exercise, ExerciseHistory, Workout } from '@/types/workout';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface ExerciseProgressionChartProps {
  workoutHistory: Record<string, Workout[]>;
}

type ExerciseWithHistory = {
  name: string;
  history: { date: Date; maxWeight: number }[];
};

const ExerciseProgressionChart: React.FC<ExerciseProgressionChartProps> = ({ workoutHistory }) => {
  const [exercises, setExercises] = useState<ExerciseWithHistory[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  useEffect(() => {
    // Extract all exercises with their history
    const exerciseMap: Record<string, { date: Date; maxWeight: number }[]> = {};
    
    Object.values(workoutHistory).forEach(workouts => {
      workouts.forEach(workout => {
        workout.exercises.forEach(exercise => {
          // Skip exercises with no completed sets
          if (!exercise.sets.some(set => set.completed)) return;
          
          // Find max weight for this exercise in this workout
          const completedSets = exercise.sets.filter(set => set.completed);
          if (completedSets.length === 0) return;
          
          const maxWeight = Math.max(...completedSets.map(set => set.weight || 0));
          
          // Skip if max weight is 0
          if (maxWeight === 0) return;
          
          if (!exerciseMap[exercise.name]) {
            exerciseMap[exercise.name] = [];
          }
          
          exerciseMap[exercise.name].push({
            date: new Date(workout.date),
            maxWeight
          });
        });
      });
    });
    
    // Convert to array and sort history by date
    const exercisesList = Object.entries(exerciseMap).map(([name, history]) => ({
      name,
      history: history.sort((a, b) => a.date.getTime() - b.date.getTime())
    }));
    
    // Sort exercises by name
    exercisesList.sort((a, b) => a.name.localeCompare(b.name));
    
    setExercises(exercisesList);
    
    // Set the first exercise as selected if available
    if (exercisesList.length > 0 && !selectedExercise) {
      setSelectedExercise(exercisesList[0].name);
    }
  }, [workoutHistory]);

  const chartData = selectedExercise
    ? exercises
        .find(ex => ex.name === selectedExercise)
        ?.history.map(item => ({
          date: format(new Date(item.date), 'dd/MM/yy', { locale: ptBR }),
          weight: item.maxWeight
        }))
    : [];

  const chartConfig = {
    weight: {
      label: "Peso (kg)",
      color: "#0EA5E9"
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Evolução de Carga por Exercício</CardTitle>
        <CardDescription>
          Acompanhe o progresso da carga máxima utilizada em cada exercício ao longo do tempo
        </CardDescription>
      </CardHeader>
      <CardContent>
        {exercises.length > 0 ? (
          <>
            <div className="mb-4">
              <Select
                value={selectedExercise || undefined}
                onValueChange={setSelectedExercise}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um exercício" />
                </SelectTrigger>
                <SelectContent>
                  {exercises.map(exercise => (
                    <SelectItem key={exercise.name} value={exercise.name}>
                      {exercise.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedExercise && chartData && chartData.length > 0 ? (
              <div className="h-64">
                <ChartContainer config={chartConfig}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#0EA5E9" 
                      activeDot={{ r: 8 }} 
                      name="Peso (kg)"
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                {selectedExercise 
                  ? "Não há dados suficientes para mostrar a evolução deste exercício" 
                  : "Selecione um exercício para ver sua evolução"}
              </p>
            )}
          </>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            Nenhum histórico de exercícios encontrado. Complete alguns treinos para ver sua evolução.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseProgressionChart;
