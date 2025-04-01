
/**
 * @file ExerciseHistory.tsx
 * @description Componente para visualização do histórico de um exercício
 * Exibe dados históricos de desempenho em forma de gráfico e tabela detalhada
 */

// Importações de bibliotecas, componentes e tipos
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ExerciseHistory } from '@/types/workout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ChartContainer, 
  ChartLegend, 
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * Definição da interface de props do componente
 * @property {ExerciseHistory[]} history - Array com o histórico do exercício
 * @property {string} exerciseName - Nome do exercício para exibição
 */
interface ExerciseHistoryProps {
  history: ExerciseHistory[];   // Array com o histórico do exercício
  exerciseName: string;         // Nome do exercício para exibição
}

/**
 * Componente para exibir o histórico de um exercício, incluindo gráfico e tabela
 * Visualiza a progressão de peso e repetições ao longo do tempo
 * 
 * @param {ExerciseHistoryProps} props - Propriedades do componente
 * @returns {JSX.Element} Interface de visualização de histórico com gráfico e tabela
 */
const ExerciseHistoryComponent: React.FC<ExerciseHistoryProps> = ({ history, exerciseName }) => {
  // Verifica se existe histórico para exibir
  if (!history || history.length === 0) {
    return <p className="text-gray-500 italic">Sem histórico disponível.</p>;
  }

  /**
   * Prepara os dados para o gráfico transformando o histórico
   * Extrai informações relevantes como data, peso máximo e total de repetições
   */
  const chartData = history.map(item => {
    // Encontra o peso máximo usado nesse dia
    const maxWeight = item.sets.reduce((max, set) => 
      set.weight && set.weight > max ? set.weight : max, 0);
    
    // Calcula o total de repetições nesse dia
    const totalReps = item.sets.reduce((total, set) => total + set.reps, 0);
    
    return {
      date: format(new Date(item.date), 'dd/MM', { locale: ptBR }),
      weight: maxWeight,
      reps: totalReps,
    };
  });

  /**
   * Configuração do gráfico com cores e legendas
   * Define como os dados serão visualizados
   */
  const chartConfig = {
    weight: {
      label: "Peso (kg)",
      color: "#0EA5E9"
    },
    reps: {
      label: "Repetições",
      color: "#10B981"
    }
  };

  return (
    <div className="space-y-4">
      {/* Título do histórico */}
      <h3 className="text-lg font-semibold">{exerciseName} - Histórico</h3>
      
      {/* Gráfico de progresso do exercício */}
      <div className="h-64 mb-4">
        <ChartContainer config={chartConfig}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" orientation="left" stroke="#0EA5E9" />
            <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
            <Tooltip content={<ChartTooltipContent />} />
            <ChartTooltip />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="weight" 
              stroke="#0EA5E9" 
              activeDot={{ r: 6 }} 
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="reps" 
              stroke="#10B981" 
            />
          </LineChart>
        </ChartContainer>
      </div>
      
      {/* Tabela detalhada do histórico */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Séries</TableHead>
            <TableHead>Repetições</TableHead>
            <TableHead>Peso Máx.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                {format(new Date(item.date), 'dd/MM/yyyy', { locale: ptBR })}
              </TableCell>
              <TableCell>{item.sets.length}</TableCell>
              <TableCell>
                {item.sets.map(set => set.reps).join(' + ')}
              </TableCell>
              <TableCell>
                {Math.max(...item.sets.map(set => set.weight || 0))} kg
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExerciseHistoryComponent;
