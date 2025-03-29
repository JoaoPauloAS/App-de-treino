
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

interface ShareWorkoutSheetProps {
  workoutSheet: WorkoutSheet;
}

const ShareWorkoutSheet: React.FC<ShareWorkoutSheetProps> = ({ workoutSheet }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Base URL for sharing - in a real app, this would be your production domain
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/workout/${workoutSheet.shareId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    
    toast({
      title: "Link copiado",
      description: "Link da ficha de treino copiado para a área de transferência.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  // Only show share button if workout is public
  if (!workoutSheet.isPublic) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Compartilhar
        </Button>
      </DialogTrigger>
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
