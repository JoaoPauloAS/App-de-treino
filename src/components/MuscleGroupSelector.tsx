
/**
 * @file MuscleGroupSelector.tsx
 * @description Seletor de grupos musculares para exercícios
 * Permite selecionar múltiplos grupos musculares via dropdown e exibe badges
 */

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

/**
 * Interface de props do componente
 * @property {MuscleGroup[]} selectedGroups - Grupos musculares atualmente selecionados
 * @property {Function} onChange - Callback para quando a seleção mudar
 */
interface MuscleGroupSelectorProps {
  selectedGroups: MuscleGroup[];
  onChange: (groups: MuscleGroup[]) => void;
}

/**
 * Lista constante de todos os grupos musculares disponíveis para seleção
 */
const MUSCLE_GROUPS: MuscleGroup[] = [
  'Peito', 'Costas', 'Quadríceps', 'Posterior', 'Ombros', 'Bíceps', 'Tríceps',
  'Abdômen', 'Glúteos', 'Panturrilha', 'Antebraço', 'Trapézio', 'Lombar'
];

/**
 * Componente para selecionar grupos musculares
 * Permite selecionar e visualizar múltiplos grupos em uma interface compacta
 * 
 * @param {MuscleGroupSelectorProps} props - Propriedades do componente
 * @returns {JSX.Element} Interface para seleção de grupos musculares
 */
const MuscleGroupSelector: React.FC<MuscleGroupSelectorProps> = ({ selectedGroups, onChange }) => {
  /**
   * Alterna a seleção de um grupo muscular
   * Adiciona ou remove o grupo da lista de selecionados
   * 
   * @param {MuscleGroup} group - Grupo muscular a alternar
   */
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
        {/* Dropdown para selecionar grupos musculares */}
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
      
      {/* Exibição dos grupos selecionados como badges */}
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
