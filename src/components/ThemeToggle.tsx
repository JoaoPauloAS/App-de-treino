
/**
 * @file ThemeToggle.tsx
 * @description Componente para alternar entre temas claro, escuro e sistema
 * Oferece uma interface de usuário para mudar o tema da aplicação
 */

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

/**
 * Componente para alternância de tema
 * Exibe um botão com menu dropdown para seleção de tema
 * 
 * @returns {JSX.Element} Botão de alternância de tema com menu de opções
 */
const ThemeToggle = () => {
  // Acessa o hook de tema para obter o tema atual e a função para alterá-lo
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      {/* Botão de acionamento do menu de tema */}
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full h-9 w-9 border-primary/20">
          {/* Ícone de sol (tema claro) - visível apenas no tema claro */}
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          {/* Ícone de lua (tema escuro) - visível apenas no tema escuro */}
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Alternar tema</span>
        </Button>
      </DropdownMenuTrigger>
      
      {/* Menu de opções de tema */}
      <DropdownMenuContent align="end">
        {/* Opção de tema claro */}
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Claro</span>
        </DropdownMenuItem>
        
        {/* Opção de tema escuro */}
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Escuro</span>
        </DropdownMenuItem>
        
        {/* Opção de tema do sistema */}
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <span className="mr-2">💻</span>
          <span>Sistema</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
