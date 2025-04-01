
// Importações de bibliotecas, componentes e tipos necessários
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

// Interface de props do componente
interface ExerciseProgressionChartProps {
  workoutHistory: Record<string, Workout[]>; // Histórico de treinos organizados por dia
}

// Tipo auxiliar para exercícios com histórico processado
type ExerciseWithHistory = {
  name: string;
  history: { date: Date; maxWeight: number }[];
};

// Componente para mostrar a evolução de carga de exercícios ao longo do tempo
const ExerciseProgressionChart: React.FC<ExerciseProgressionChartProps> = ({ workoutHistory }) => {
  // Estados para armazenar a lista de exercícios e o exercício selecionado
  const [exercises, setExercises] = useState<ExerciseWithHistory[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  // Processa o histórico de treinos para extrair os dados de evolução dos exercícios
  useEffect(() => {
    // Mapa para armazenar o histórico de cada exercício
    const exerciseMap: Record<string, { date: Date; maxWeight: number }[]> = {};
    
    // Percorre todos os treinos no histórico
    Object.values(workoutHistory).forEach(workouts => {
      workouts.forEach(workout => {
        workout.exercises.forEach(exercise => {
          // Pula exercícios sem séries completadas
          if (!exercise.sets.some(set => set.completed)) return;
          
          // Encontra o peso máximo para este exercício neste treino
          const completedSets = exercise.sets.filter(set => set.completed);
          if (completedSets.length === 0) return;
          
          const maxWeight = Math.max(...completedSets.map(set => set.weight || 0));
          
          // Pula se o peso máximo for 0
          if (maxWeight === 0) return;
          
          // Inicializa o array de histórico para o exercício se não existir
          if (!exerciseMap[exercise.name]) {
            exerciseMap[exercise.name] = [];
          }
          
          // Adiciona o registro ao histórico do exercício
          exerciseMap[exercise.name].push({
            date: new Date(workout.date),
            maxWeight
          });
        });
      });
    });
    
    // Converte o mapa para um array e ordena o histórico por data
    const exercisesList = Object.entries(exerciseMap).map(([name, history]) => ({
      name,
      history: history.sort((a, b) => a.date.getTime() - b.date.getTime())
    }));
    
    // Ordena a lista de exercícios por nome
    exercisesList.sort((a, b) => a.name.localeCompare(b.name));
    
    setExercises(exercisesList);
    
    // Define o primeiro exercício como selecionado, se disponível
    if (exercisesList.length > 0 && !selectedExercise) {
      setSelectedExercise(exercisesList[0].name);
    }
  }, [workoutHistory]);

  // Prepara os dados para o gráfico do exercício selecionado
  const chartData = selectedExercise
    ? exercises
        .find(ex => ex.name === selectedExercise)
        ?.history.map(item => ({
          date: format(new Date(item.date), 'dd/MM/yy', { locale: ptBR }),
          weight: item.maxWeight
        }))
    : [];

  // Configuração para o gráfico
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
            {/* Seletor de exercício */}
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
            
            {/* Gráfico de evolução do exercício */}
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
