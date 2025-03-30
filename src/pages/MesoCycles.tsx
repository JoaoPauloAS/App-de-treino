
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { MesoCycle, WorkoutSheet } from '@/types/workout';
import ThemeToggle from '@/components/ThemeToggle';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import MesoCycleList from '@/components/MesoCycleList';
import MesoCycleForm from '@/components/MesoCycleForm';
import WorkoutSheetList from '@/components/WorkoutSheetList';
import WorkoutSheetForm from '@/components/WorkoutSheetForm';
import { Calendar, FolderClock } from 'lucide-react';

const MesoCycles = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [mesoCycles, setMesoCycles] = useState<MesoCycle[]>([]);
  const [workoutSheets, setWorkoutSheets] = useState<WorkoutSheet[]>([]);

  // Efeito para carregar os dados quando o componente montar
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Carregar fichas de treino
    const storedWorkoutSheets = localStorage.getItem('workoutSheets');
    if (storedWorkoutSheets) {
      try {
        const parsedSheets = JSON.parse(storedWorkoutSheets);
        const userSheets = parsedSheets.filter((sheet: WorkoutSheet) => 
          sheet.createdBy === user?.id
        );
        setWorkoutSheets(userSheets);
      } catch (error) {
        console.error('Erro ao carregar fichas de treino:', error);
      }
    }

    // Carregar meso ciclos
    const storedMesoCycles = localStorage.getItem('mesoCycles');
    if (storedMesoCycles) {
      try {
        const parsedMesoCycles = JSON.parse(storedMesoCycles);
        
        // Converter strings de data para objetos Date
        const formattedMesoCycles = parsedMesoCycles.map((cycle: any) => ({
          ...cycle,
          startDate: new Date(cycle.startDate),
          endDate: new Date(cycle.endDate),
          createdAt: new Date(cycle.createdAt)
        }));
        
        const userMesoCycles = formattedMesoCycles.filter((cycle: MesoCycle) => 
          cycle.createdBy === user?.id
        );
        
        setMesoCycles(userMesoCycles);
      } catch (error) {
        console.error('Erro ao carregar meso ciclos:', error);
      }
    }
  }, [isAuthenticated, navigate, user]);

  // Funções para gerenciar fichas de treino
  const handleSaveWorkoutSheet = (workoutSheet: WorkoutSheet) => {
    const isNew = !workoutSheets.some(sheet => sheet.id === workoutSheet.id);
    
    const updatedSheets = isNew 
      ? [...workoutSheets, workoutSheet] 
      : workoutSheets.map(sheet => sheet.id === workoutSheet.id ? workoutSheet : sheet);
    
    setWorkoutSheets(updatedSheets);
    
    // Salvar no localStorage
    const allSheets = localStorage.getItem('workoutSheets');
    let sheets = [];
    
    if (allSheets) {
      try {
        sheets = JSON.parse(allSheets);
        // Remover a ficha existente (se estiver atualizando)
        sheets = sheets.filter((sheet: WorkoutSheet) => sheet.id !== workoutSheet.id);
      } catch (error) {
        console.error('Erro ao analisar fichas de treino:', error);
      }
    }
    
    sheets.push(workoutSheet);
    localStorage.setItem('workoutSheets', JSON.stringify(sheets));
    
    toast({
      title: isNew ? "Ficha criada" : "Ficha atualizada",
      description: `A ficha "${workoutSheet.name}" foi ${isNew ? 'criada' : 'atualizada'} com sucesso!`,
    });
  };

  const handleDeleteWorkoutSheet = (id: string) => {
    // Verificar se a ficha está em uso em algum meso ciclo
    const isUsedInMesoCycle = mesoCycles.some(cycle => 
      cycle.workoutSheetIds.includes(id)
    );
    
    if (isUsedInMesoCycle) {
      toast({
        title: "Não é possível excluir",
        description: "Esta ficha está sendo usada em um ou mais meso ciclos.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedSheets = workoutSheets.filter(sheet => sheet.id !== id);
    setWorkoutSheets(updatedSheets);
    
    // Atualizar no localStorage
    const allSheets = localStorage.getItem('workoutSheets');
    if (allSheets) {
      try {
        const sheets = JSON.parse(allSheets);
        const filteredSheets = sheets.filter((sheet: WorkoutSheet) => sheet.id !== id);
        localStorage.setItem('workoutSheets', JSON.stringify(filteredSheets));
      } catch (error) {
        console.error('Erro ao excluir ficha de treino:', error);
      }
    }
    
    toast({
      title: "Ficha excluída",
      description: "A ficha de treino foi excluída com sucesso.",
    });
  };

  const handleSelectWorkoutSheet = (workoutSheet: WorkoutSheet) => {
    // Salvar a ficha selecionada para uso na tela principal
    localStorage.setItem('selectedWorkoutSheet', JSON.stringify(workoutSheet));
    navigate('/');
    
    toast({
      title: "Ficha selecionada",
      description: `A ficha "${workoutSheet.name}" foi selecionada para uso.`,
    });
  };

  // Funções para gerenciar meso ciclos
  const handleSaveMesoCycle = (mesoCycle: MesoCycle) => {
    const isNew = !mesoCycles.some(cycle => cycle.id === mesoCycle.id);
    
    const updatedCycles = isNew 
      ? [...mesoCycles, mesoCycle] 
      : mesoCycles.map(cycle => cycle.id === mesoCycle.id ? mesoCycle : cycle);
    
    setMesoCycles(updatedCycles);
    
    // Salvar no localStorage
    const allCycles = localStorage.getItem('mesoCycles');
    let cycles = [];
    
    if (allCycles) {
      try {
        cycles = JSON.parse(allCycles);
        // Remover o ciclo existente (se estiver atualizando)
        cycles = cycles.filter((cycle: MesoCycle) => cycle.id !== mesoCycle.id);
      } catch (error) {
        console.error('Erro ao analisar meso ciclos:', error);
      }
    }
    
    cycles.push(mesoCycle);
    localStorage.setItem('mesoCycles', JSON.stringify(cycles));
    
    toast({
      title: isNew ? "Meso ciclo criado" : "Meso ciclo atualizado",
      description: `O meso ciclo "${mesoCycle.name}" foi ${isNew ? 'criado' : 'atualizado'} com sucesso!`,
    });
  };

  const handleDeleteMesoCycle = (id: string) => {
    const updatedCycles = mesoCycles.filter(cycle => cycle.id !== id);
    setMesoCycles(updatedCycles);
    
    // Atualizar no localStorage
    const allCycles = localStorage.getItem('mesoCycles');
    if (allCycles) {
      try {
        const cycles = JSON.parse(allCycles);
        const filteredCycles = cycles.filter((cycle: MesoCycle) => cycle.id !== id);
        localStorage.setItem('mesoCycles', JSON.stringify(filteredCycles));
      } catch (error) {
        console.error('Erro ao excluir meso ciclo:', error);
      }
    }
    
    toast({
      title: "Meso ciclo excluído",
      description: "O meso ciclo foi excluído com sucesso.",
    });
  };

  const handleSelectWorkoutSheetFromMesoCycle = (id: string) => {
    const workoutSheet = workoutSheets.find(sheet => sheet.id === id);
    if (workoutSheet) {
      handleSelectWorkoutSheet(workoutSheet);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FolderClock className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">Meus Meso Ciclos</h1>
        </div>
        <ThemeToggle />
      </div>

      <Tabs defaultValue="mesocycles">
        <TabsList className="mb-6">
          <TabsTrigger value="mesocycles" className="flex items-center">
            <FolderClock className="h-4 w-4 mr-2" />
            Meso Ciclos
          </TabsTrigger>
          <TabsTrigger value="workoutsheets" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Fichas de Treino
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mesocycles">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Meus Meso Ciclos</h2>
            <MesoCycleForm 
              mesoCycle={null} 
              workoutSheets={workoutSheets}
              onSave={handleSaveMesoCycle} 
            />
          </div>
          
          <MesoCycleList 
            mesoCycles={mesoCycles}
            workoutSheets={workoutSheets}
            onUpdate={handleSaveMesoCycle}
            onDelete={handleDeleteMesoCycle}
            onSelectWorkoutSheet={handleSelectWorkoutSheetFromMesoCycle}
          />
        </TabsContent>

        <TabsContent value="workoutsheets">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Minhas Fichas de Treino</h2>
            <WorkoutSheetForm workout={null} onSave={handleSaveWorkoutSheet} />
          </div>
          
          <WorkoutSheetList 
            workoutSheets={workoutSheets}
            onSelect={handleSelectWorkoutSheet}
            onUpdate={handleSaveWorkoutSheet}
            onDelete={handleDeleteWorkoutSheet}
          />
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <Button onClick={() => navigate('/')}>Voltar para o treino</Button>
      </div>
    </div>
  );
};

export default MesoCycles;
