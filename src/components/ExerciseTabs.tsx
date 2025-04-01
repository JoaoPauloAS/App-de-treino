
/**
 * @file ExerciseTabs.tsx
 * @description Componente de abas para exibir diferentes visualizações de um exercício
 * Permite alternar entre informações do exercício, histórico e comentários
 */

// Importações de React, componentes UI e tipos
import React, { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Exercise } from '@/types/workout';
import ExerciseHistory from './ExerciseHistory';
import { MessageSquare, BarChart2 } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

/**
 * Definição da interface de props do componente
 * @property {Exercise} exercise - Dados do exercício a ser exibido
 * @property {ReactNode} children - Conteúdo da aba principal (normalmente o ExerciseCard)
 * @property {ReactNode} commentTab - Conteúdo opcional da aba de comentários
 */
interface ExerciseTabsProps {
  exercise: Exercise;                // Dados do exercício
  children: ReactNode;               // Conteúdo da aba principal (normalmente o ExerciseCard)
  commentTab?: ReactNode;            // Conteúdo opcional da aba de comentários
}

/**
 * Componente de abas para mostrar diferentes visualizações de um exercício
 * Organiza a interface em abas para melhor experiência do usuário
 * 
 * @param {ExerciseTabsProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente de abas para visualização do exercício
 */
const ExerciseTabs: React.FC<ExerciseTabsProps> = ({ exercise, children, commentTab }) => {
  // Verifica se o exercício tem histórico e comentários
  const hasHistory = exercise.history && exercise.history.length > 0;
  const hasComments = exercise.comments && exercise.comments.length > 0;
  
  // Conta o número de comentários para exibição no badge
  const commentCount = exercise.comments?.length || 0;

  return (
    <Tabs defaultValue="exercise" className="w-full">
      {/* Cabeçalho das abas */}
      <TabsList className="w-full bg-muted rounded-t-xl rounded-b-none border-b border-border/30 p-1">
        {/* Aba principal do exercício */}
        <TabsTrigger value="exercise" className="data-[state=active]:bg-background rounded-lg">
          Exercício
        </TabsTrigger>
        
        {/* Aba de histórico (mostrada apenas se houver histórico) */}
        {hasHistory && (
          <TabsTrigger value="history" className="data-[state=active]:bg-background rounded-lg">
            <div className="flex items-center gap-1">
              <BarChart2 className="w-4 h-4" />
              <span>Histórico</span>
            </div>
          </TabsTrigger>
        )}
        
        {/* Aba de comentários */}
        <TabsTrigger value="comments" className="flex items-center gap-1 data-[state=active]:bg-background rounded-lg">
          <MessageSquare className="w-4 h-4" />
          <span>Comentários</span>
          {/* Badge com contador de comentários e tooltip */}
          {commentCount > 0 && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="ml-1 bg-primary/20 text-primary rounded-full px-2 py-0.5 text-xs">
                  {commentCount}
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-64">
                <p className="text-sm">
                  Este exercício tem {commentCount} comentário{commentCount !== 1 ? 's' : ''}.
                </p>
              </HoverCardContent>
            </HoverCard>
          )}
        </TabsTrigger>
      </TabsList>
      
      {/* Conteúdo da aba principal (Exercício) */}
      <TabsContent value="exercise" className="mt-2 p-3 animate-in fade-in">
        {children}
      </TabsContent>
      
      {/* Conteúdo da aba de histórico (mostrado apenas se houver histórico) */}
      {hasHistory && (
        <TabsContent value="history" className="mt-2 p-3 animate-in fade-in">
          <ExerciseHistory 
            history={exercise.history || []} 
            exerciseName={exercise.name} 
          />
        </TabsContent>
      )}
      
      {/* Conteúdo da aba de comentários */}
      <TabsContent value="comments" className="mt-2 p-3 animate-in fade-in">
        {commentTab}
      </TabsContent>
    </Tabs>
  );
};

export default ExerciseTabs;
