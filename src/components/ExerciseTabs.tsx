
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExerciseHistoryComponent from './ExerciseHistory';
import { Exercise } from '@/types/workout';
import { BarChart3 } from 'lucide-react';

interface ExerciseTabsProps {
  exercise: Exercise;
  children: React.ReactNode;
}

const ExerciseTabs: React.FC<ExerciseTabsProps> = ({ exercise, children }) => {
  return (
    <Tabs defaultValue="current" className="w-full">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="current">Treino atual</TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-1">
          <BarChart3 className="w-4 h-4" />
          <span>Histórico</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="current" className="mt-0">
        {children}
      </TabsContent>
      
      <TabsContent value="history" className="mt-0">
        <ExerciseHistoryComponent 
          history={exercise.history || []} 
          exerciseName={exercise.name} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default ExerciseTabs;
