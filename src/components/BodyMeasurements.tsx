
/**
 * @file BodyMeasurements.tsx
 * @description Componente para gerenciar medições corporais do usuário
 * Permite adicionar, editar e excluir medições com persistência no localStorage
 */

// Importações de React, componentes e tipos necessários
import React, { useState } from 'react';
import { BodyMeasurement } from '@/types/workout';
import { Button } from '@/components/ui/button';
import { Ruler } from 'lucide-react';
import BodyMeasurementForm from './BodyMeasurementForm';
import BodyMeasurementList from './BodyMeasurementList';
import { useToast } from '@/components/ui/use-toast';

/**
 * Componente principal para gerenciamento de medições corporais
 * Centraliza a lógica de CRUD para medições corporais do usuário
 * 
 * @returns {JSX.Element} Interface para gerenciamento de medições corporais
 */
const BodyMeasurements: React.FC = () => {
  // Hook para exibir notificações toast
  const { toast } = useToast();
  
  /**
   * Estado para armazenar a lista de medições corporais
   * Inicializado com dados do localStorage se disponíveis
   */
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>(() => {
    // Carrega medições salvas do localStorage ao inicializar o componente
    const saved = localStorage.getItem('bodyMeasurements');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Converte strings de data para objetos Date
        return parsed.map((m: any) => ({
          ...m,
          date: new Date(m.date)
        }));
      } catch (error) {
        console.error('Erro ao carregar medições:', error);
        return [];
      }
    }
    return [];
  });
  
  // Estado para controlar a exibição do formulário de novas medições
  const [showForm, setShowForm] = useState(false);
  
  /**
   * Função para salvar uma nova medição
   * Adiciona à lista e persiste no localStorage
   * 
   * @param {BodyMeasurement} measurement - Nova medição a ser salva
   */
  const saveMeasurement = (measurement: BodyMeasurement) => {
    const updated = [...measurements, measurement];
    setMeasurements(updated);
    localStorage.setItem('bodyMeasurements', JSON.stringify(updated));
    setShowForm(false);
    
    toast({
      title: "Medição salva",
      description: "Sua medição corporal foi salva com sucesso.",
    });
  };
  
  /**
   * Função para atualizar uma medição existente
   * Substitui a medição antiga pela nova versão
   * 
   * @param {BodyMeasurement} updated - Medição atualizada
   */
  const updateMeasurement = (updated: BodyMeasurement) => {
    const updatedList = measurements.map(m => 
      m.id === updated.id ? updated : m
    );
    setMeasurements(updatedList);
    localStorage.setItem('bodyMeasurements', JSON.stringify(updatedList));
    
    toast({
      title: "Medição atualizada",
      description: "Sua medição corporal foi atualizada com sucesso.",
    });
  };
  
  /**
   * Função para excluir uma medição
   * Remove a medição da lista e atualiza o localStorage
   * 
   * @param {string} id - ID da medição a ser excluída
   */
  const deleteMeasurement = (id: string) => {
    const filtered = measurements.filter(m => m.id !== id);
    setMeasurements(filtered);
    localStorage.setItem('bodyMeasurements', JSON.stringify(filtered));
    
    toast({
      title: "Medição excluída",
      description: "Sua medição corporal foi excluída com sucesso.",
    });
  };
  
  // Renderização do componente
  return (
    <div className="space-y-6">
      {/* Cabeçalho com título e botão para adicionar nova medição */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Medições Corporais</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Ruler className="mr-2 h-4 w-4" />
          {showForm ? 'Cancelar' : 'Nova Medição'}
        </Button>
      </div>
      
      {/* Formulário para adicionar nova medição (visível apenas quando showForm é true) */}
      {showForm && (
        <div className="mb-6">
          <BodyMeasurementForm onSave={saveMeasurement} />
        </div>
      )}
      
      {/* Lista de medições existentes */}
      <BodyMeasurementList
        measurements={measurements}
        onUpdate={updateMeasurement}
        onDelete={deleteMeasurement}
      />
    </div>
  );
};

export default BodyMeasurements;
