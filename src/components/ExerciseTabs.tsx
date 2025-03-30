
import React, { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Exercise } from '@/types/workout';
import ExerciseHistory from './ExerciseHistory';
import { MessageSquare, BarChart2 } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface ExerciseTabsProps {
  exercise: Exercise;
  children: ReactNode;
  commentTab?: ReactNode;
}

const ExerciseTabs: React.FC<ExerciseTabsProps> = ({ exercise, children, commentTab }) => {
  const hasHistory = exercise.history && exercise.history.length > 0;
  const hasComments = exercise.comments && exercise.comments.length > 0;
  
  const commentCount = exercise.comments?.length || 0;

  return (
    <Tabs defaultValue="exercise" className="w-full">
      <TabsList className="w-full bg-muted rounded-t-xl rounded-b-none border-b border-border/30 p-1">
        <TabsTrigger value="exercise" className="data-[state=active]:bg-background rounded-lg">
          Exercício
        </TabsTrigger>
        {hasHistory && (
          <TabsTrigger value="history" className="data-[state=active]:bg-background rounded-lg">
            <div className="flex items-center gap-1">
              <BarChart2 className="w-4 h-4" />
              <span>Histórico</span>
            </div>
          </TabsTrigger>
        )}
        <TabsTrigger value="comments" className="flex items-center gap-1 data-[state=active]:bg-background rounded-lg">
          <MessageSquare className="w-4 h-4" />
          <span>Comentários</span>
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
      
      <TabsContent value="exercise" className="mt-2 p-3 animate-in fade-in">
        {children}
      </TabsContent>
      
      {hasHistory && (
        <TabsContent value="history" className="mt-2 p-3 animate-in fade-in">
          <ExerciseHistory 
            history={exercise.history || []} 
            exerciseName={exercise.name} 
          />
        </TabsContent>
      )}
      
      <TabsContent value="comments" className="mt-2 p-3 animate-in fade-in">
        {commentTab}
      </TabsContent>
    </Tabs>
  );
};

export default ExerciseTabs;
