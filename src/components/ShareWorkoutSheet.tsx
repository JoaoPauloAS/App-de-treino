
/**
 * @file ShareWorkoutSheet.tsx
 * @description Componente para compartilhar fichas de treino
 * Permite gerar e copiar links para compartilhamento
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { WorkoutSheet } from '@/types/workout';
import { Share2, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * Interface de props do componente
 * @property {WorkoutSheet} workoutSheet - Ficha de treino a ser compartilhada
 */
interface ShareWorkoutSheetProps {
  workoutSheet: WorkoutSheet;
}

/**
 * Componente para compartilhar fichas de treino
 * Exibe um diálogo com link de compartilhamento copiável
 * 
 * @param {ShareWorkoutSheetProps} props - Propriedades do componente
 * @returns {JSX.Element | null} Interface para compartilhamento ou null se ficha não for pública
 */
const ShareWorkoutSheet: React.FC<ShareWorkoutSheetProps> = ({ workoutSheet }) => {
  // Estado para controlar abertura do diálogo
  const [open, setOpen] = useState(false);
  // Estado para controlar feedback visual de cópia
  const [copied, setCopied] = useState(false);
  // Hook para exibir notificações toast
  const { toast } = useToast();

  // Base URL para compartilhamento - em um app real, seria o domínio de produção
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/workout/${workoutSheet.shareId}`;

  /**
   * Manipula a cópia do link para a área de transferência
   * Mostra feedback visual e notificação
   */
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    
    toast({
      title: "Link copiado",
      description: "Link da ficha de treino copiado para a área de transferência.",
    });
    
    // Reset do estado de cópia após 2 segundos
    setTimeout(() => setCopied(false), 2000);
  };

  // Só exibe o botão de compartilhamento se a ficha for pública
  if (!workoutSheet.isPublic) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Botão para abrir o diálogo de compartilhamento */}
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Compartilhar
        </Button>
      </DialogTrigger>
      
      {/* Conteúdo do diálogo de compartilhamento */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Compartilhar Ficha de Treino</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4">
            Compartilhe esta ficha de treino com seus amigos usando o link abaixo:
          </p>
          <div className="flex items-center space-x-2">
            <Input 
              value={shareUrl} 
              readOnly 
              className="flex-1"
            />
            <Button size="sm" onClick={handleCopy} variant="outline">
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareWorkoutSheet;
