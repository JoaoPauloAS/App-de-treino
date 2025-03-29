import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Exercise, Workout, Weekday, ExerciseHistory, WorkoutSheet } from '@/types/workout';
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
import { ClipboardList, BarChart3, Dumbbell } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
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
    localStorage.setItem('currentWorkout', JSON.stringify(workout));
    
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
        ...workout,
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
    const updatedSheets = workoutSheets.some(sheet => sheet.id === workoutSheet.id)
      ? workoutSheets.map(sheet => sheet.id === workoutSheet.id ? workoutSheet : sheet)
      : [...workoutSheets, workoutSheet];
    
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
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="current" className="flex items-center gap-1">
            <Dumbbell className="w-4 h-4" />
            <span>Treino Atual</span>
          </TabsTrigger>
          <TabsTrigger value="sheets" className="flex items-center gap-1">
            <ClipboardList className="w-4 h-4" />
            <span>Fichas</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-1">
            <BarChart3 className="w-4 h-4" />
            <span>Análise</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="current">
          <WorkoutHeader 
            date={workout.date} 
            onSave={handleSaveWorkout}
            selectedDay={selectedDay}
          />
          
          <div className="flex justify-between items-center mb-6">
            <div className="w-3/4">
              <h2 className="text-lg font-medium mb-2">Dia do Treino</h2>
              <WeekdaySelector 
                selectedDay={selectedDay} 
                onChange={handleSelectWeekday} 
              />
            </div>
            <div className="flex flex-col gap-2">
              <WorkoutSheetForm
                workout={null}
                onSave={handleSaveWorkoutSheet}
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCreateWorkoutSheetFromCurrent}
              >
                Salvar como Ficha
              </Button>
            </div>
          </div>
          
          <div className="mb-6 space-y-4">
            {workout.exercises.map(exercise => (
              <div key={exercise.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <ExerciseTabs exercise={exercise}>
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Minhas Fichas de Treino</h2>
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
      </Tabs>
    </div>
  );
};

export default Index;
