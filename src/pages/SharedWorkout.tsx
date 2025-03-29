
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { WorkoutSheet, Exercise } from '@/types/workout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent
} from '@/components/ui/card';
import { CalendarIcon, ArrowLeft, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SharedWorkout = () => {
  const { id } = useParams<{ id: string }>();
  const [workoutSheet, setWorkoutSheet] = useState<WorkoutSheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }

    // Load workout sheets from localStorage
    const savedSheets = localStorage.getItem('workoutSheets');
    if (savedSheets) {
      try {
        const parsedSheets: WorkoutSheet[] = JSON.parse(savedSheets);
        // Convert string dates back to Date objects
        parsedSheets.forEach(sheet => {
          sheet.createdAt = new Date(sheet.createdAt);
        });

        // Find the sheet with the matching shareId
        const sheet = parsedSheets.find(s => s.shareId === id && s.isPublic);
        
        if (sheet) {
          setWorkoutSheet(sheet);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error parsing workout sheets:', err);
        setError(true);
      }
    } else {
      setError(true);
    }
    
    setLoading(false);
  }, [id]);

  const handleCopyWorkout = () => {
    if (!workoutSheet) return;
    
    // Load existing workouts
    const savedWorkouts = localStorage.getItem('workoutHistory') || '{}';
    const workoutHistory = JSON.parse(savedWorkouts);
    
    // Create a new workout based on the shared workout sheet
    const newWorkout = {
      id: crypto.randomUUID(),
      name: workoutSheet.name,
      exercises: workoutSheet.exercises,
      date: new Date(),
      weekday: workoutSheet.weekday
    };
    
    // Add the new workout to localStorage
    if (workoutSheet.weekday) {
      if (!workoutHistory[workoutSheet.weekday]) {
        workoutHistory[workoutSheet.weekday] = [];
      }
      workoutHistory[workoutSheet.weekday].push(newWorkout);
      localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
    }
    
    // Save as current workout
    localStorage.setItem('currentWorkout', JSON.stringify(newWorkout));
    
    toast({
      title: "Ficha copiada",
      description: "A ficha foi copiada e está pronta para uso.",
    });
  };

  if (loading) {
    return <div className="text-center py-12">Carregando...</div>;
  }

  if (error || !workoutSheet) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ficha não encontrada</h1>
          <p className="mb-6">A ficha de treino que você está procurando não existe ou não está disponível para compartilhamento.</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o início
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <div className="mb-6 flex justify-between items-center">
        <Link to="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <Button onClick={handleCopyWorkout}>
          <Copy className="mr-2 h-4 w-4" />
          Copiar Ficha
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{workoutSheet.name}</CardTitle>
          <CardDescription>
            {workoutSheet.weekday && (
              <div className="flex items-center text-sm">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>{workoutSheet.weekday}</span>
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workoutSheet.description && (
            <p className="mb-4">{workoutSheet.description}</p>
          )}
          
          <h3 className="text-lg font-medium mb-4">Exercícios</h3>
          <div className="space-y-4">
            {workoutSheet.exercises.map((exercise: Exercise) => (
              <div key={exercise.id} className="p-4 border rounded-md">
                <h4 className="font-medium">{exercise.name}</h4>
                <div className="mt-2 text-sm text-muted-foreground">
                  <p>{exercise.sets.length} séries • {exercise.restTimeMinutes} min de descanso</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SharedWorkout;
