
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WorkoutSheet, Exercise } from '@/types/workout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ExerciseTabs from '@/components/ExerciseTabs';
import ExerciseCard from '@/components/ExerciseCard';
import { useToast } from '@/hooks/use-toast';
import { Share, ArrowLeft, Bookmark, BookmarkCheck } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import ExerciseCommentsTab from '@/components/ExerciseCommentsTab';
import { v4 as uuidv4 } from 'uuid';

const SharedWorkout = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  const [workout, setWorkout] = useState<WorkoutSheet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    const fetchWorkout = () => {
      setIsLoading(true);
      
      // Buscar de localStorage (em produção seria uma API)
      const workoutSheets = localStorage.getItem('workoutSheets');
      
      if (workoutSheets) {
        try {
          const sheets = JSON.parse(workoutSheets);
          
          // Buscar por ID ou shareId
          const foundWorkout = sheets.find((sheet: WorkoutSheet) => 
            sheet.id === id || sheet.shareId === id
          );
          
          if (foundWorkout) {
            setWorkout(foundWorkout);
            
            // Verificar se o treino está salvo pelo usuário
            if (isAuthenticated && user?.savedWorkouts) {
              setIsSaved(user.savedWorkouts.includes(foundWorkout.id));
            }
          } else {
            toast({
              title: "Treino não encontrado",
              description: "O treino que você está tentando acessar não existe.",
              variant: "destructive",
            });
            navigate('/');
          }
        } catch (error) {
          console.error('Erro ao buscar treino:', error);
          toast({
            title: "Erro",
            description: "Ocorreu um erro ao buscar o treino.",
            variant: "destructive",
          });
        }
      }
      
      setIsLoading(false);
    };
    
    fetchWorkout();
  }, [id, navigate, toast, user, isAuthenticated]);

  const handleExerciseUpdate = (updatedExercise: Exercise) => {
    if (!workout) return;
    
    const updatedExercises = workout.exercises.map(ex => 
      ex.id === updatedExercise.id ? updatedExercise : ex
    );
    
    const updatedWorkout = {
      ...workout,
      exercises: updatedExercises
    };
    
    // Atualizar na memória
    setWorkout(updatedWorkout);
    
    // Atualizar no localStorage (em produção seria uma API)
    const workoutSheets = localStorage.getItem('workoutSheets');
    
    if (workoutSheets) {
      try {
        const sheets = JSON.parse(workoutSheets);
        
        const updatedSheets = sheets.map((sheet: WorkoutSheet) => 
          sheet.id === workout.id ? updatedWorkout : sheet
        );
        
        localStorage.setItem('workoutSheets', JSON.stringify(updatedSheets));
      } catch (error) {
        console.error('Erro ao atualizar treino:', error);
      }
    }
  };

  const handleSaveWorkout = () => {
    if (!isAuthenticated) {
      toast({
        title: "Não autenticado",
        description: "Faça login para salvar este treino.",
      });
      navigate('/login');
      return;
    }
    
    if (!workout || !user) return;
    
    // Atualizar lista de treinos salvos do usuário
    const updatedSavedWorkouts = user.savedWorkouts 
      ? [...user.savedWorkouts, workout.id]
      : [workout.id];
    
    const updatedUser = {
      ...user,
      savedWorkouts: updatedSavedWorkouts
    };
    
    // Atualizar no localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    setIsSaved(true);
    
    toast({
      title: "Treino salvo",
      description: "O treino foi adicionado aos seus favoritos.",
    });
  };

  const handleRemoveSavedWorkout = () => {
    if (!isAuthenticated || !workout || !user) return;
    
    // Remover da lista de treinos salvos do usuário
    const updatedSavedWorkouts = user.savedWorkouts?.filter(id => id !== workout.id) || [];
    
    const updatedUser = {
      ...user,
      savedWorkouts: updatedSavedWorkouts
    };
    
    // Atualizar no localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    setIsSaved(false);
    
    toast({
      title: "Treino removido",
      description: "O treino foi removido dos seus favoritos.",
    });
  };

  const handleUseWorkout = () => {
    if (!workout) return;
    
    // Criar um novo treino a partir da ficha compartilhada
    const newWorkout = {
      id: uuidv4(),
      name: workout.name,
      exercises: workout.exercises.map(ex => ({
        ...ex,
        id: uuidv4(),
        sets: ex.sets.map(set => ({
          ...set,
          id: uuidv4(),
          completed: false
        }))
      })),
      date: new Date(),
      weekday: workout.weekday
    };
    
    // Salvar no localStorage
    localStorage.setItem('currentWorkout', JSON.stringify(newWorkout));
    
    toast({
      title: "Treino aplicado",
      description: "O treino foi aplicado ao seu treino atual.",
    });
    
    navigate('/');
  };

  const handleShareWorkout = () => {
    const shareUrl = `${window.location.origin}/workout/${id}`;
    
    navigator.clipboard.writeText(shareUrl);
    
    toast({
      title: "Link copiado",
      description: "Link para compartilhamento copiado para a área de transferência.",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="text-center">Carregando treino...</div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="text-center">Treino não encontrado</div>
        <Button onClick={() => navigate('/')} className="mt-4">
          Voltar para a página inicial
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <ThemeToggle />
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">{workout.name}</CardTitle>
          <CardDescription>
            {workout.weekday && `Dia: ${workout.weekday}`}
            {workout.description && <div>{workout.description}</div>}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="text-sm text-muted-foreground mb-2">
            {workout.exercises.length} exercícios
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button onClick={handleUseWorkout}>
              Usar este treino
            </Button>
            
            <Button variant="outline" onClick={handleShareWorkout}>
              <Share className="w-4 h-4 mr-1" />
              Compartilhar
            </Button>
          </div>
          
          {isAuthenticated && (
            isSaved ? (
              <Button variant="outline" onClick={handleRemoveSavedWorkout}>
                <BookmarkCheck className="w-4 h-4 mr-1" />
                Salvo
              </Button>
            ) : (
              <Button variant="outline" onClick={handleSaveWorkout}>
                <Bookmark className="w-4 h-4 mr-1" />
                Salvar
              </Button>
            )
          )}
        </CardFooter>
      </Card>
      
      <div className="space-y-4">
        <h2 className="text-xl font-bold mb-4">Exercícios</h2>
        
        {workout.exercises.map(exercise => (
          <div key={exercise.id} className="bg-card rounded-lg shadow-md overflow-hidden">
            <ExerciseTabs 
              exercise={exercise}
              commentTab={
                <ExerciseCommentsTab
                  exercise={exercise}
                  onExerciseUpdate={handleExerciseUpdate}
                />
              }
            >
              <ExerciseCard
                exercise={exercise}
                onExerciseUpdate={handleExerciseUpdate}
                readOnly={true}
              />
            </ExerciseTabs>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <Button onClick={() => navigate('/')}>
          Voltar para meus treinos
        </Button>
      </div>
    </div>
  );
};

export default SharedWorkout;
