
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Comment, Exercise } from '@/types/workout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface ExerciseCommentsProps {
  exercise: Exercise;
  onUpdateExercise: (exercise: Exercise) => void;
}

const ExerciseComments: React.FC<ExerciseCommentsProps> = ({ exercise, onUpdateExercise }) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState('');

  const handleAddComment = () => {
    if (!isAuthenticated) {
      toast({
        title: "Não autenticado",
        description: "Você precisa estar logado para adicionar comentários.",
        variant: "destructive",
      });
      return;
    }

    if (!commentText.trim()) {
      toast({
        title: "Erro",
        description: "O comentário não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }

    const newComment: Comment = {
      id: uuidv4(),
      userId: user?.id || '',
      userName: user?.username || 'Anônimo',
      text: commentText.trim(),
      createdAt: new Date(),
    };

    const updatedExercise = {
      ...exercise,
      comments: exercise.comments 
        ? [...exercise.comments, newComment] 
        : [newComment],
    };

    onUpdateExercise(updatedExercise);
    setCommentText('');
    
    toast({
      title: "Comentário adicionado",
      description: "Seu comentário foi adicionado com sucesso.",
    });
  };

  const handleDeleteComment = (commentId: string) => {
    if (!exercise.comments) return;

    const updatedComments = exercise.comments.filter(comment => comment.id !== commentId);
    
    const updatedExercise = {
      ...exercise,
      comments: updatedComments,
    };

    onUpdateExercise(updatedExercise);
    
    toast({
      title: "Comentário removido",
      description: "O comentário foi removido com sucesso.",
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-4 space-y-4">
      <h3 className="text-lg font-medium">Comentários</h3>
      
      {isAuthenticated ? (
        <div className="space-y-2">
          <Textarea
            placeholder="Adicione um comentário sobre este exercício..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="min-h-24"
          />
          <Button onClick={handleAddComment}>Adicionar Comentário</Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Faça login para adicionar comentários.
        </p>
      )}
      
      <div className="space-y-4 mt-4">
        {exercise.comments && exercise.comments.length > 0 ? (
          exercise.comments.map((comment) => (
            <div 
              key={comment.id} 
              className="bg-muted/50 p-3 rounded-md"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{comment.userName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
                
                {user?.id === comment.userId && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    Excluir
                  </Button>
                )}
              </div>
              
              <p className="mt-2 text-sm">{comment.text}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </p>
        )}
      </div>
    </div>
  );
};

export default ExerciseComments;
