
// Importações de bibliotecas, componentes e tipos necessários
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Comment, Exercise } from '@/types/workout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

// Interface de props do componente
interface ExerciseCommentsProps {
  exercise: Exercise;                           // Dados do exercício
  onUpdateExercise: (exercise: Exercise) => void; // Função para atualizar exercício com novos comentários
}

// Componente para gerenciar comentários em exercícios
const ExerciseComments: React.FC<ExerciseCommentsProps> = ({ exercise, onUpdateExercise }) => {
  // Acesso ao contexto de autenticação para verificar usuário logado
  const { user, isAuthenticated } = useAuth();
  // Hook para exibir notificações toast
  const { toast } = useToast();
  // Estado para armazenar o texto do comentário sendo digitado
  const [commentText, setCommentText] = useState('');

  // Função para adicionar um novo comentário
  const handleAddComment = () => {
    // Verifica se o usuário está autenticado
    if (!isAuthenticated) {
      toast({
        title: "Não autenticado",
        description: "Você precisa estar logado para adicionar comentários.",
        variant: "destructive",
      });
      return;
    }

    // Verifica se o comentário não está vazio
    if (!commentText.trim()) {
      toast({
        title: "Erro",
        description: "O comentário não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }

    // Cria o objeto de novo comentário
    const newComment: Comment = {
      id: uuidv4(),                        // ID único para o comentário
      userId: user?.id || '',              // ID do usuário que criou o comentário
      userName: user?.username || 'Anônimo', // Nome do usuário
      text: commentText.trim(),            // Texto do comentário (sem espaços extras)
      createdAt: new Date(),               // Data de criação do comentário
    };

    // Atualiza o exercício com o novo comentário
    const updatedExercise = {
      ...exercise,
      comments: exercise.comments 
        ? [...exercise.comments, newComment] 
        : [newComment],
    };

    // Chama a função de atualização e limpa o campo de texto
    onUpdateExercise(updatedExercise);
    setCommentText('');
    
    // Notifica o usuário sobre o sucesso da operação
    toast({
      title: "Comentário adicionado",
      description: "Seu comentário foi adicionado com sucesso.",
    });
  };

  // Função para excluir um comentário
  const handleDeleteComment = (commentId: string) => {
    if (!exercise.comments) return;

    // Filtra o comentário a ser excluído
    const updatedComments = exercise.comments.filter(comment => comment.id !== commentId);
    
    // Atualiza o exercício com a lista filtrada de comentários
    const updatedExercise = {
      ...exercise,
      comments: updatedComments,
    };

    // Chama a função de atualização
    onUpdateExercise(updatedExercise);
    
    // Notifica o usuário sobre o sucesso da operação
    toast({
      title: "Comentário removido",
      description: "O comentário foi removido com sucesso.",
    });
  };

  // Função auxiliar para formatar data de criação do comentário
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
      
      {/* Formulário de comentário (se autenticado) ou mensagem para login */}
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
      
      {/* Lista de comentários existentes */}
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
                
                {/* Botão de exclusão (visível apenas para o autor do comentário) */}
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
