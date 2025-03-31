import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Exercise, Workout, Weekday, ExerciseHistory, WorkoutSheet, BodyMeasurement } from '@/types/workout';
import ExerciseCard from '@/components/ExerciseCard';
import ExerciseForm from '@/components/ExerciseForm';
import WorkoutHeader from '@/components/WorkoutHeader';
import WeekdaySelector from '@/components/WeekdaySelector';
import ExerciseTabs from '@/components/ExerciseTabs';
import WorkoutSheetForm from '@/components/WorkoutSheetForm';
import WorkoutSheetList from '@/components/WorkoutSheetList';
import WeeklyVolumeAnalysis from '@/components/WeeklyVolumeAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { v4 as uuidv4 } from 'uuid';
import { ClipboardList, BarChart3, Dumbbell, Ruler, Users, LogIn, LogOut, ListMinus } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import WorkoutStats from '@/components/WorkoutStats';
import BodyMeasurements from '@/components/BodyMeasurements';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ExerciseCommentsTab from '@/components/ExerciseCommentsTab';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const isMobile = useIsMobile();
  
  const [workout, setWorkout] = useState<Workout>({
    id: uuidv4(),
    name: 'Meu Treino',
    exercises: [],
    date: new Date(),
  });
  
  const [selectedDay, setSelectedDay] = useState<Weekday | undefined>(undefined);
  const [workoutHistory, setWorkoutHistory] = useState<Record<string, Workout[]>>({});
  const [workoutSheets, setWorkoutSheets] = useState<WorkoutSheet[]>([]);
  const [activeTab, setActiveTab] = useState("current");

  useEffect(() => {
    const savedWorkout = localStorage.getItem('currentWorkout');
    if (savedWorkout) {
      try {
        const parsedWorkout = JSON.parse(savedWorkout);
        parsedWorkout.date = new Date(parsedWorkout.date);
        setWorkout(parsedWorkout);
        if (parsedWorkout.weekday) {
          setSelectedDay(parsedWorkout.weekday as Weekday);
        }
      } catch (error) {
        console.error('Error parsing saved workout:', error);
      }
    }
    
    const savedHistory = localStorage.getItem('workoutHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        Object.keys(parsedHistory).forEach(key => {
          parsedHistory[key] = parsedHistory[key].map((w: any) => ({
            ...w,
            date: new Date(w.date)
          }));
        });
        setWorkoutHistory(parsedHistory);
      } catch (error) {
        console.error('Error parsing workout history:', error);
      }
    }
    
    const savedSheets = localStorage.getItem('workoutSheets');
    if (savedSheets) {
      try {
        const parsedSheets = JSON.parse(savedSheets);
        parsedSheets.forEach((sheet: any) => {
          sheet.createdAt = new Date(sheet.createdAt);
        });
        setWorkoutSheets(parsedSheets);
      } catch (error) {
        console.error('Error parsing workout sheets:', error);
      }
    }
  }, []);

  const handleAddExercise = (exercise: Exercise) => {
    if (workoutHistory) {
      const exerciseHistory: ExerciseHistory[] = [];
      
      Object.values(workoutHistory).forEach(workouts => {
        workouts.forEach(w => {
          const found = w.exercises.find(e => e.name === exercise.name);
          if (found && found.sets.some(s => s.completed)) {
            exerciseHistory.push({
              date: w.date,
              sets: found.sets
            });
          }
        });
      });
      
      if (exerciseHistory.length > 0) {
        exercise.history = exerciseHistory;
      }
    }
    
    setWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, exercise],
    }));
  };

  const handleUpdateExercise = (updatedExercise: Exercise) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === updatedExercise.id ? updatedExercise : ex
      ),
    }));
  };

  const handleSelectWeekday = (day: Weekday) => {
    setSelectedDay(day);
    
    setWorkout(prev => ({
      ...prev,
      weekday: day
    }));
    
    const workoutsForDay = workoutHistory[day] || [];
    if (workoutsForDay.length > 0) {
      const lastWorkout = workoutsForDay[workoutsForDay.length - 1];
      
      setWorkout(prev => ({
        ...prev,
        name: lastWorkout.name,
        exercises: lastWorkout.exercises.map(ex => ({
          ...ex,
          id: uuidv4(),
          sets: ex.sets.map(set => ({
            ...set,
            id: uuidv4(),
            completed: false
          }))
        })),
        weekday: day
      }));
      
      toast({
        title: "Treino carregado",
        description: `Treino de ${day} carregado com base no histórico.`,
      });
    }
  };

  const handleSaveWorkout = () => {
    const workoutToSave = {
      ...workout,
      createdBy: user?.id
    };
    
    localStorage.setItem('currentWorkout', JSON.stringify(workoutToSave));
    
    const hasCompletedSets = workout.exercises.some(ex => 
      ex.sets.some(set => set.completed)
    );
    
    if (hasCompletedSets) {
      const updatedHistory = { ...workoutHistory };
      const weekday = workout.weekday || 'SemDia';
      
      if (!updatedHistory[weekday]) {
        updatedHistory[weekday] = [];
      }
      
      updatedHistory[weekday].push({
        ...workoutToSave,
        id: uuidv4(),
        date: new Date()
      });
      
      setWorkoutHistory(updatedHistory);
      localStorage.setItem('workoutHistory', JSON.stringify(updatedHistory));
      
      toast({
        title: "Treino salvo",
        description: "Seu treino foi salvo e adicionado ao histórico.",
      });
    } else {
      toast({
        title: "Treino salvo",
        description: "Seu treino foi salvo, mas não foi adicionado ao histórico porque nenhum exercício foi completado.",
      });
    }
  };

  const handleSaveWorkoutSheet = (workoutSheet: WorkoutSheet) => {
    const sheetToSave = {
      ...workoutSheet,
      createdBy: user?.id
    };
    
    const updatedSheets = workoutSheets.some(sheet => sheet.id === sheetToSave.id)
      ? workoutSheets.map(sheet => sheet.id === sheetToSave.id ? sheetToSave : sheet)
      : [...workoutSheets, sheetToSave];
    
    setWorkoutSheets(updatedSheets);
    localStorage.setItem('workoutSheets', JSON.stringify(updatedSheets));
    
    toast({
      title: "Ficha salva",
      description: "Sua ficha de treino foi salva com sucesso.",
    });
  };

  const handleDeleteWorkoutSheet = (id: string) => {
    const updatedSheets = workoutSheets.filter(sheet => sheet.id !== id);
    setWorkoutSheets(updatedSheets);
    localStorage.setItem('workoutSheets', JSON.stringify(updatedSheets));
    
    toast({
      title: "Ficha excluída",
      description: "A ficha de treino foi excluída com sucesso.",
    });
  };

  const handleSelectWorkoutSheet = (sheet: WorkoutSheet) => {
    setWorkout(prev => ({
      ...prev,
      name: sheet.name,
      exercises: sheet.exercises.map(ex => ({
        ...ex,
        id: uuidv4(),
        sets: ex.sets.map(set => ({
          ...set,
          id: uuidv4(),
          completed: false
        }))
      })),
      weekday: sheet.weekday,
    }));
    
    if (sheet.weekday) {
      setSelectedDay(sheet.weekday);
    }
    
    setActiveTab("current");
    
    toast({
      title: "Ficha aplicada",
      description: "A ficha de treino foi aplicada ao seu treino atual.",
    });
  };
  
  const handleCreateWorkoutSheetFromCurrent = () => {
    if (workout.exercises.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione exercícios ao seu treino antes de criar uma ficha.",
      });
      return;
    }
    
    const newWorkoutSheet: WorkoutSheet = {
      id: uuidv4(),
      name: workout.name,
      description: "",
      weekday: workout.weekday as Weekday | undefined,
      exercises: workout.exercises.map(ex => ({
        ...ex,
        sets: ex.sets.map(set => ({
          ...set,
          completed: false
        }))
      })),
      isPublic: false,
      shareId: uuidv4(),
      createdAt: new Date(),
      createdBy: user?.id,
    };
    
    setWorkoutSheets([...workoutSheets, newWorkoutSheet]);
    localStorage.setItem('workoutSheets', JSON.stringify([...workoutSheets, newWorkoutSheet]));
    
    setActiveTab("sheets");
    
    toast({
      title: "Ficha criada",
      description: "Uma nova ficha de treino foi criada com base no seu treino atual.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <div>
          {isAuthenticated && (
            <div className="text-sm">
              Olá, <span className="font-medium">{user?.username}</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isAuthenticated ? (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/shared')}
              >
                <Users className="w-4 h-4 mr-1" />
                <span className={isMobile ? 'hidden' : 'inline'}>Treinos Compartilhados</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/mesocycles')}
              >
                <ListMinus className="w-4 h-4 mr-1" />
                <span className={isMobile ? 'hidden' : 'inline'}>Meso Ciclos</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  logout();
                  toast({
                    title: "Logout realizado",
                    description: "Você saiu da sua conta com sucesso.",
                  });
                }}
              >
                <LogOut className="w-4 h-4 mr-1" />
                <span className={isMobile ? 'hidden' : 'inline'}>Sair</span>
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/login')}
            >
              <LogIn className="w-4 h-4 mr-1" />
              <span className={isMobile ? 'hidden' : 'inline'}>Login / Cadastro</span>
            </Button>
          )}
          
          <ThemeToggle />
        </div>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2 gap-1 mb-4' : 'grid-cols-4 mb-4'}`}>
          <TabsTrigger value="current" className="flex items-center gap-1">
            <Dumbbell className="w-4 h-4" />
            <span>Treino</span>
          </TabsTrigger>
          <TabsTrigger value="sheets" className="flex items-center gap-1">
            <ClipboardList className="w-4 h-4" />
            <span>Fichas</span>
          </TabsTrigger>
          {isMobile && (
            <>
              <TabsTrigger value="analysis" className="flex items-center gap-1 mt-1">
                <BarChart3 className="w-4 h-4" />
                <span>Análise</span>
              </TabsTrigger>
              <TabsTrigger value="measurements" className="flex items-center gap-1 mt-1">
                <Ruler className="w-4 h-4" />
                <span>Medições</span>
              </TabsTrigger>
            </>
          )}
          {!isMobile && (
            <>
              <TabsTrigger value="analysis" className="flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                <span>Análise</span>
              </TabsTrigger>
              <TabsTrigger value="measurements" className="flex items-center gap-1">
                <Ruler className="w-4 h-4" />
                <span>Medições</span>
              </TabsTrigger>
            </>
          )}
        </TabsList>
        
        <TabsContent value="current">
          <WorkoutStats workoutHistory={workoutHistory} />
          
          <WorkoutHeader 
            date={workout.date} 
            onSave={handleSaveWorkout}
            selectedDay={selectedDay}
          />
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="w-full sm:w-3/4">
              <h2 className="text-lg font-medium mb-2">Dia do Treino</h2>
              <WeekdaySelector 
                selectedDay={selectedDay} 
                onChange={handleSelectWeekday} 
              />
            </div>
            <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
              <WorkoutSheetForm
                workout={null}
                onSave={handleSaveWorkoutSheet}
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCreateWorkoutSheetFromCurrent}
                className="text-sm"
              >
                Salvar como Ficha
              </Button>
            </div>
          </div>
          
          <div className="mb-6 space-y-4">
            {workout.exercises.map(exercise => (
              <div key={exercise.id} className="bg-card rounded-lg shadow-md overflow-hidden">
                <ExerciseTabs 
                  exercise={exercise}
                  commentTab={
                    <ExerciseCommentsTab 
                      exercise={exercise} 
                      onExerciseUpdate={handleUpdateExercise} 
                    />
                  }
                >
                  <ExerciseCard
                    exercise={exercise}
                    onExerciseUpdate={handleUpdateExercise}
                  />
                </ExerciseTabs>
              </div>
            ))}
          </div>
          
          <ExerciseForm onAddExercise={handleAddExercise} />
        </TabsContent>
        
        <TabsContent value="sheets">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <h2 className="text-xl font-bold mb-4 sm:mb-0">Minhas Fichas de Treino</h2>
              <WorkoutSheetForm
                workout={null}
                onSave={handleSaveWorkoutSheet}
              />
            </div>
            <WorkoutSheetList 
              workoutSheets={workoutSheets}
              onSelect={handleSelectWorkoutSheet}
              onUpdate={handleSaveWorkoutSheet}
              onDelete={handleDeleteWorkoutSheet}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="analysis">
          <WeeklyVolumeAnalysis workoutHistory={workoutHistory} />
        </TabsContent>
        
        <TabsContent value="measurements">
          <BodyMeasurements />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
