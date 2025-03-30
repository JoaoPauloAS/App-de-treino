
import React, { useState } from 'react';
import { BodyMeasurement } from '@/types/workout';
import { Button } from '@/components/ui/button';
import { Ruler } from 'lucide-react';
import BodyMeasurementForm from './BodyMeasurementForm';
import BodyMeasurementList from './BodyMeasurementList';
import { useToast } from '@/components/ui/use-toast';

const BodyMeasurements: React.FC = () => {
  const { toast } = useToast();
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>(() => {
    const saved = localStorage.getItem('bodyMeasurements');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
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
  
  const [showForm, setShowForm] = useState(false);
  
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
  
  const deleteMeasurement = (id: string) => {
    const filtered = measurements.filter(m => m.id !== id);
    setMeasurements(filtered);
    localStorage.setItem('bodyMeasurements', JSON.stringify(filtered));
    
    toast({
      title: "Medição excluída",
      description: "Sua medição corporal foi excluída com sucesso.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Medições Corporais</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Ruler className="mr-2 h-4 w-4" />
          {showForm ? 'Cancelar' : 'Nova Medição'}
        </Button>
      </div>
      
      {showForm && (
        <div className="mb-6">
          <BodyMeasurementForm onSave={saveMeasurement} />
        </div>
      )}
      
      <BodyMeasurementList
        measurements={measurements}
        onUpdate={updateMeasurement}
        onDelete={deleteMeasurement}
      />
    </div>
  );
};

export default BodyMeasurements;
