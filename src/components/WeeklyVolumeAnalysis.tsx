
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { MuscleGroup, Workout } from '@/types/workout';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface WeeklyVolumeAnalysisProps {
  workoutHistory: Record<string, Workout[]>;
}

// Cores para cada grupo muscular
const MUSCLE_GROUP_COLORS: Record<MuscleGroup, string> = {
  'Peito': '#FF8042',
  'Costas': '#0088FE',
  'Pernas': '#00C49F',
  'Ombros': '#FFBB28',
  'Bíceps': '#FF0000',
  'Tríceps': '#00FF00',
  'Abdômen': '#0000FF',
  'Glúteos': '#FF00FF',
  'Panturrilha': '#00FFFF',
  'Antebraço': '#FF7F00',
  'Trapézio': '#7F00FF',
  'Lombar': '#7F7F7F'
};

const WeeklyVolumeAnalysis: React.FC<WeeklyVolumeAnalysisProps> = ({ workoutHistory }) => {
  const [volumeData, setVolumeData] = useState<{ name: string; sets: number; color: string }[]>([]);
  const [pieData, setPieData] = useState<{ name: string; value: number; color: string }[]>([]);
  
  useEffect(() => {
    const calculateWeeklyVolume = () => {
      const muscleGroups: Record<string, number> = {};
      
      // Percorre todos os treinos do histórico
      Object.values(workoutHistory).forEach(workouts => {
        workouts.forEach(workout => {
          // Considera apenas treinos da última semana
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          
          if (new Date(workout.date) >= oneWeekAgo) {
            workout.exercises.forEach(exercise => {
              // Se o exercício tiver grupos musculares definidos
              if (exercise.muscleGroups && exercise.muscleGroups.length > 0) {
                // Conta as séries completadas para cada grupo muscular
                const completedSets = exercise.sets.filter(set => set.completed).length;
                
                exercise.muscleGroups.forEach(group => {
                  muscleGroups[group] = (muscleGroups[group] || 0) + completedSets;
                });
              }
            });
          }
        });
      });
      
      // Converte para o formato do gráfico de barras
      const barData = Object.entries(muscleGroups).map(([name, sets]) => ({
        name,
        sets,
        color: MUSCLE_GROUP_COLORS[name as MuscleGroup] || '#000000'
      }));
      
      // Converte para o formato do gráfico de pizza
      const pieChartData = Object.entries(muscleGroups).map(([name, value]) => ({
        name,
        value,
        color: MUSCLE_GROUP_COLORS[name as MuscleGroup] || '#000000'
      }));
      
      setVolumeData(barData);
      setPieData(pieChartData);
    };
    
    calculateWeeklyVolume();
  }, [workoutHistory]);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Volume Semanal por Grupo Muscular</CardTitle>
        <CardDescription>
          Total de séries realizadas para cada grupo muscular nos últimos 7 dias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bar" className="w-full">
          <TabsList className="mb-4 grid grid-cols-2">
            <TabsTrigger value="bar">Gráfico de Barras</TabsTrigger>
            <TabsTrigger value="pie">Gráfico de Pizza</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bar">
            {volumeData.length > 0 ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Séries', angle: -90, position: 'insideLeft' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="sets" name="Séries">
                      {volumeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-gray-500 my-8">
                Sem dados de treino na última semana ou faltam grupos musculares nos exercícios.
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="pie">
            {pieData.length > 0 ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-gray-500 my-8">
                Sem dados de treino na última semana ou faltam grupos musculares nos exercícios.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Componente de tooltip personalizado para o gráfico de barras
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
        <p className="font-semibold">{label}</p>
        <p>{`${payload[0].value} séries`}</p>
      </div>
    );
  }
  
  return null;
};

// Componente de tooltip personalizado para o gráfico de pizza
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
        <p className="font-semibold">{payload[0].name}</p>
        <p>{`${payload[0].value} séries (${Math.round(payload[0].percent * 100)}%)`}</p>
      </div>
    );
  }
  
  return null;
};

// Função para renderizar os rótulos no gráfico de pizza
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius * 1.1;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
  return percent > 0.05 ? (
    <text
      x={x}
      y={y}
      fill="#333"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

export default WeeklyVolumeAnalysis;
