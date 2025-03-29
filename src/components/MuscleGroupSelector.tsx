
import React from 'react';
import { MuscleGroup } from '@/types/workout';
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";

interface MuscleGroupSelectorProps {
  selectedGroups: MuscleGroup[];
  onChange: (groups: MuscleGroup[]) => void;
}

const MUSCLE_GROUPS: MuscleGroup[] = [
  'Peito', 'Costas', 'Quadríceps', 'Posterior', 'Ombros', 'Bíceps', 'Tríceps',
  'Abdômen', 'Glúteos', 'Panturrilha', 'Antebraço', 'Trapézio', 'Lombar'
];

const MuscleGroupSelector: React.FC<MuscleGroupSelectorProps> = ({ selectedGroups, onChange }) => {
  const toggleMuscleGroup = (group: MuscleGroup) => {
    const isSelected = selectedGroups.includes(group);
    
    if (isSelected) {
      onChange(selectedGroups.filter(g => g !== group));
    } else {
      onChange([...selectedGroups, group]);
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Grupos Musculares:</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <span>Selecionar</span>
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {MUSCLE_GROUPS.map(group => (
              <DropdownMenuCheckboxItem
                key={group}
                checked={selectedGroups.includes(group)}
                onCheckedChange={() => toggleMuscleGroup(group)}
              >
                {selectedGroups.includes(group) && (
                  <Check className="h-4 w-4 mr-2" />
                )}
                {group}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {selectedGroups.map(group => (
          <Badge 
            key={group} 
            variant="secondary"
            className="cursor-pointer"
            onClick={() => toggleMuscleGroup(group)}
          >
            {group} ×
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default MuscleGroupSelector;
