
/**
 * @file ExerciseForm.tsx
 * @description Formulário para adicionar novos exercícios ao treino
 * Permite configurar nome, séries, repetições, tempo de descanso e grupos musculares
 */

// Importações de bibliotecas e componentes necessários
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Exercise, MuscleGroup } from '@/types/workout';
import MuscleGroupSelector from './MuscleGroupSelector';

/**
 * Definição da interface para as props do componente
 * @property {Function} onAddExercise - Função callback para adicionar um novo exercício
 */
interface ExerciseFormProps {
  onAddExercise: (exercise: Exercise) => void; // Função callback para adicionar um novo exercício
}

/**
 * Componente de formulário para adicionar novos exercícios
 * Captura informações de configuração e cria um novo objeto de exercício
 * 
 * @param {ExerciseFormProps} props - Propriedades do componente
 * @returns {JSX.Element} Formulário para criação de exercícios
 */
const ExerciseForm: React.FC<ExerciseFormProps> = ({ onAddExercise }) => {
  // Estados locais para armazenar os valores do formulário
  const [name, setName] = useState('');                     // Nome do exercício
  const [sets, setSets] = useState(3);                      // Número de séries
  const [reps, setReps] = useState(12);                     // Repetições por série
  const [restTime, setRestTime] = useState(1);              // Tempo de descanso em minutos
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]); // Grupos musculares trabalhados

  /**
   * Função para lidar com o envio do formulário
   * Cria um novo objeto de exercício e passa para o callback
   * 
   * @param {React.FormEvent} e - Evento de submissão do formulário
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Criar novo objeto de exercício com os valores do formulário
    const exercise: Exercise = {
      id: uuidv4(), // Gera um ID único para o exercício
      name,
      restTimeMinutes: restTime,
      muscleGroups, // Incluir grupos musculares
      sets: Array(sets).fill(0).map(() => ({
        id: uuidv4(), // Gera IDs únicos para cada série
        reps,
        weight: 0,
        completed: false
      }))
    };
    
    // Chamar a função de callback passada via props
    onAddExercise(exercise);
    
    // Limpar o formulário para nova entrada
    setName('');
    setSets(3);
    setReps(12);
  };

  // Renderização do componente
  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo de nome do exercício */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Exercício</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Supino Reto"
              required
            />
          </div>
          
          {/* Campos para número de séries e repetições */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sets">Número de Séries</Label>
              <Input
                id="sets"
                type="number"
                min="1"
                value={sets}
                onChange={(e) => setSets(Number(e.target.value))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reps">Repetições por Série</Label>
              <Input
                id="reps"
                type="number"
                min="1"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                required
              />
            </div>
          </div>
          
          {/* Campo para tempo de descanso */}
          <div className="space-y-2">
            <Label htmlFor="rest">Tempo de Descanso (minutos)</Label>
            <Input
              id="rest"
              type="number"
              min="0.5"
              step="0.5"
              value={restTime}
              onChange={(e) => setRestTime(Number(e.target.value))}
              required
            />
          </div>
          
          {/* Seletor de grupos musculares */}
          <MuscleGroupSelector
            selectedGroups={muscleGroups}
            onChange={setMuscleGroups}
          />
          
          {/* Botão de submissão do formulário */}
          <Button type="submit" className="w-full">Adicionar Exercício</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExerciseForm;
