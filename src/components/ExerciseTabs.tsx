
import React, { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Exercise } from '@/types/workout';
import ExerciseHistory from './ExerciseHistory';
import { MessageSquare } from 'lucide-react';

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
      <TabsList className="w-full bg-muted">
        <TabsTrigger value="exercise" className="data-[state=active]:bg-background">Exercício</TabsTrigger>
        {hasHistory && <TabsTrigger value="history" className="data-[state=active]:bg-background">Histórico</TabsTrigger>}
        <TabsTrigger value="comments" className="flex items-center gap-1 data-[state=active]:bg-background">
          <MessageSquare className="w-4 h-4" />
          <span>Comentários</span>
          {commentCount > 0 && (
            <span className="ml-1 bg-primary/20 text-primary rounded-full px-2 py-0.5 text-xs">
              {commentCount}
            </span>
          )}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="exercise" className="mt-2">
        {children}
      </TabsContent>
      
      {hasHistory && (
        <TabsContent value="history" className="mt-2">
          <ExerciseHistory 
            history={exercise.history || []} 
            exerciseName={exercise.name} 
          />
        </TabsContent>
      )}
      
      <TabsContent value="comments" className="mt-2">
        {commentTab}
      </TabsContent>
    </Tabs>
  );
};

export default ExerciseTabs;
