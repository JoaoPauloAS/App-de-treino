
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Workout, WorkoutSheet } from '@/types/workout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Share, Eye, Bookmark, BookmarkCheck } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ThemeToggle from '@/components/ThemeToggle';

const SharedWorkouts = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [sharedWithMe, setSharedWithMe] = useState<WorkoutSheet[]>([]);
  const [myShared, setMyShared] = useState<WorkoutSheet[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<WorkoutSheet[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Carregar treinos compartilhados comigo
    const workoutSheets = localStorage.getItem('workoutSheets');
    if (workoutSheets) {
      try {
        const parsedSheets = JSON.parse(workoutSheets);
        
        // Filtrar treinos compartilhados comigo
        const shared = parsedSheets.filter((sheet: WorkoutSheet) => 
          sheet.sharedWith?.includes(user?.id || '')
        );
        
        // Filtrar treinos que eu compartilhei
        const mine = parsedSheets.filter((sheet: WorkoutSheet) => 
          sheet.createdBy === user?.id
        );
        
        // Filtrar treinos salvos
        const saved = parsedSheets.filter((sheet: WorkoutSheet) => 
          user?.savedWorkouts?.includes(sheet.id)
        );
        
        setSharedWithMe(shared);
        setMyShared(mine);
        setSavedWorkouts(saved);
      } catch (error) {
        console.error('Erro ao carregar treinos compartilhados:', error);
      }
    }
  }, [isAuthenticated, navigate, user]);

  const handleViewWorkout = (workoutId: string) => {
    navigate(`/workout/${workoutId}`);
  };

  const handleSaveWorkout = (workout: WorkoutSheet) => {
    if (!user) return;
    
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
    
    // Atualizar a lista de treinos salvos
    setSavedWorkouts([...savedWorkouts, workout]);
    
    toast({
      title: "Treino salvo",
      description: "O treino foi adicionado aos seus favoritos.",
    });
  };

  const handleRemoveSavedWorkout = (workoutId: string) => {
    if (!user) return;
    
    // Remover da lista de treinos salvos do usuário
    const updatedSavedWorkouts = user.savedWorkouts?.filter(id => id !== workoutId) || [];
    
    const updatedUser = {
      ...user,
      savedWorkouts: updatedSavedWorkouts
    };
    
    // Atualizar no localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Atualizar a lista de treinos salvos
    setSavedWorkouts(savedWorkouts.filter(workout => workout.id !== workoutId));
    
    toast({
      title: "Treino removido",
      description: "O treino foi removido dos seus favoritos.",
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const isWorkoutSaved = (workoutId: string) => {
    return user?.savedWorkouts?.includes(workoutId) || false;
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Treinos Compartilhados</h1>
        <ThemeToggle />
      </div>

      <Tabs defaultValue="shared">
        <TabsList className="mb-6">
          <TabsTrigger value="shared">Compartilhados Comigo</TabsTrigger>
          <TabsTrigger value="my-shared">Meus Compartilhados</TabsTrigger>
          <TabsTrigger value="saved">Treinos Salvos</TabsTrigger>
        </TabsList>

        <TabsContent value="shared">
          {sharedWithMe.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Treinos compartilhados com você</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Dia</TableHead>
                    <TableHead>Exercícios</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sharedWithMe.map((workout) => (
                    <TableRow key={workout.id}>
                      <TableCell className="font-medium">{workout.name}</TableCell>
                      <TableCell>{workout.weekday || '-'}</TableCell>
                      <TableCell>{workout.exercises.length}</TableCell>
                      <TableCell>{formatDate(workout.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewWorkout(workout.shareId || workout.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
                          
                          {isWorkoutSaved(workout.id) ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveSavedWorkout(workout.id)}
                            >
                              <BookmarkCheck className="w-4 h-4 mr-1" />
                              Salvo
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSaveWorkout(workout)}
                            >
                              <Bookmark className="w-4 h-4 mr-1" />
                              Salvar
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Nenhum treino compartilhado com você ainda.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="my-shared">
          {myShared.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Seus treinos compartilhados</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Dia</TableHead>
                    <TableHead>Exercícios</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myShared.map((workout) => (
                    <TableRow key={workout.id}>
                      <TableCell className="font-medium">{workout.name}</TableCell>
                      <TableCell>{workout.weekday || '-'}</TableCell>
                      <TableCell>{workout.exercises.length}</TableCell>
                      <TableCell>{formatDate(workout.createdAt)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const shareUrl = `${window.location.origin}/workout/${workout.shareId || workout.id}`;
                            navigator.clipboard.writeText(shareUrl);
                            toast({
                              title: "Link copiado",
                              description: "Link para compartilhamento copiado para a área de transferência.",
                            });
                          }}
                        >
                          <Share className="w-4 h-4 mr-1" />
                          Copiar link
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Você ainda não compartilhou nenhum treino.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="saved">
          {savedWorkouts.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Seus treinos salvos</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Dia</TableHead>
                    <TableHead>Exercícios</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savedWorkouts.map((workout) => (
                    <TableRow key={workout.id}>
                      <TableCell className="font-medium">{workout.name}</TableCell>
                      <TableCell>{workout.weekday || '-'}</TableCell>
                      <TableCell>{workout.exercises.length}</TableCell>
                      <TableCell>{formatDate(workout.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewWorkout(workout.shareId || workout.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveSavedWorkout(workout.id)}
                          >
                            <BookmarkCheck className="w-4 h-4 mr-1" />
                            Remover
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Você ainda não salvou nenhum treino.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <Button onClick={() => navigate('/')}>Voltar para o treino</Button>
      </div>
    </div>
  );
};

export default SharedWorkouts;
