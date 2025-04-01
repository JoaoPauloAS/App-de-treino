
/**
 * @file ExerciseProgressionChart.tsx
 * @description Componente para visualização da progressão de exercícios ao longo do tempo
 * Cria gráficos de evolução de carga e performance para exercícios específicos
 */

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

/**
 * Interface de props do componente
 * @property {Record<string, Workout[]>} workoutHistory - Histórico de treinos organizados por dia
 */
interface ExerciseProgressionChartProps {
  workoutHistory: Record<string, Workout[]>; // Histórico de treinos organizados por dia
}

/**
 * Tipo auxiliar para exercícios com histórico processado
 * Facilita a organização e exibição dos dados
 */
type ExerciseWithHistory = {
  name: string;
  history: { date: Date; maxWeight: number }[];
};

/**
 * Componente para mostrar a evolução de carga de exercícios ao longo do tempo
 * Permite selecionar exercícios específicos e visualizar sua progressão
 * 
 * @param {ExerciseProgressionChartProps} props - Propriedades do componente
 * @returns {JSX.Element} Gráfico de progressão de exercícios
 */
const ExerciseProgressionChart: React.FC<ExerciseProgressionChartProps> = ({ workoutHistory }) => {
  // Estados para armazenar a lista de exercícios e o exercício selecionado
  const [exercises, setExercises] = useState<ExerciseWithHistory[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  /**
   * Processa o histórico de treinos para extrair os dados de evolução dos exercícios
   * Agrupa dados por exercício para facilitar visualização
   */
  useEffect(() => {
    // Processa o histórico para extrair dados de progressão
    const exerciseMap = new Map<string, { name: string; history: { date: Date; maxWeight: number }[] }>();
    
    // Percorre todos os treinos no histórico
    Object.values(workoutHistory).forEach(workouts => {
      workouts.forEach(workout => {
        const date = new Date(workout.date);
        
        // Processa cada exercício do treino
        workout.exercises.forEach(exercise => {
          // Encontra o peso máximo usado no exercício
          const maxWeight = Math.max(...exercise.sets.map(set => set.weight || 0));
          
          // Se não há carga, ignora este exercício
          if (maxWeight === 0) return;
          
          // Adiciona ou atualiza o exercício no mapa
          if (!exerciseMap.has(exercise.name)) {
            exerciseMap.set(exercise.name, {
              name: exercise.name,
              history: [{ date, maxWeight }]
            });
          } else {
            const existing = exerciseMap.get(exercise.name)!;
            existing.history.push({ date, maxWeight });
          }
        });
      });
    });
    
    // Converte o mapa para array e ordena os exercícios
    const exerciseArray = Array.from(exerciseMap.values())
      .filter(ex => ex.history.length > 1) // Apenas exercícios com mais de um registro
      .sort((a, b) => a.name.localeCompare(b.name));
    
    setExercises(exerciseArray);
    
    // Seleciona automaticamente o primeiro exercício se houver dados
    if (exerciseArray.length > 0 && !selectedExercise) {
      setSelectedExercise(exerciseArray[0].name);
    }
  }, [workoutHistory, selectedExercise]);

  /**
   * Encontra os dados do exercício selecionado
   */
  const selectedExerciseData = selectedExercise 
    ? exercises.find(ex => ex.name === selectedExercise) 
    : null;

  /**
   * Prepara os dados para o gráfico
   * Formata datas e organiza os valores para visualização
   */
  const chartData = selectedExerciseData 
    ? selectedExerciseData.history
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(item => ({
        date: format(item.date, 'dd/MM', { locale: ptBR }),
        weight: item.maxWeight
      }))
    : [];

  /**
   * Configuração do gráfico com cores e legendas
   */
  const chartConfig = {
    weight: {
      label: "Peso (kg)",
      color: "#0EA5E9"
    }
  };

  // Se não houver dados, mostra mensagem informativa
  if (exercises.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progressão de Exercícios</CardTitle>
          <CardDescription>Acompanhe sua evolução nos principais exercícios</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Sem dados suficientes para mostrar a progressão.
            Complete mais treinos para visualizar seu progresso.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progressão de Exercícios</CardTitle>
        <CardDescription>Acompanhe sua evolução em cargas máximas</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Seletor de exercício */}
        <div className="mb-4">
          <Select 
            value={selectedExercise || ''} 
            onValueChange={setSelectedExercise}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um exercício" />
            </SelectTrigger>
            <SelectContent>
              {exercises.map(ex => (
                <SelectItem key={ex.name} value={ex.name}>
                  {ex.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Gráfico de progressão */}
        {selectedExerciseData && (
          <div className="h-64">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#0EA5E9" 
                    strokeWidth={2}
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseProgressionChart;
