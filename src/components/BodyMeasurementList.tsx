
// Importações de bibliotecas, componentes e tipos necessários
import React, { useState } from 'react';
import { BodyMeasurement } from '@/types/workout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import BodyMeasurementForm from './BodyMeasurementForm';

// Interface de props do componente
interface BodyMeasurementListProps {
  measurements: BodyMeasurement[];                    // Lista de medições para exibir
  onUpdate: (measurement: BodyMeasurement) => void;   // Função para atualizar uma medição
  onDelete: (id: string) => void;                     // Função para excluir uma medição
}

// Componente para exibir uma lista de medições corporais
const BodyMeasurementList: React.FC<BodyMeasurementListProps> = ({
  measurements,
  onUpdate,
  onDelete,
}) => {
  // Estado para controlar a medição em edição
  const [editMeasurement, setEditMeasurement] = useState<BodyMeasurement | null>(null);
  // Estado para controlar a visibilidade do diálogo de edição
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Ordenando medições por data (mais recente primeiro)
  const sortedMeasurements = [...measurements].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Manipulador para iniciar a edição de uma medição
  const handleEdit = (measurement: BodyMeasurement) => {
    setEditMeasurement(measurement);
    setIsEditDialogOpen(true);
  };
  
  // Manipulador para confirmar a atualização de uma medição
  const handleUpdate = (updated: BodyMeasurement) => {
    onUpdate(updated);
    setIsEditDialogOpen(false);
    setEditMeasurement(null);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Medições</CardTitle>
      </CardHeader>
      <CardContent>
        {measurements.length === 0 ? (
          // Mensagem quando não há medições
          <div className="text-center py-6 text-muted-foreground">
            Nenhuma medição registrada ainda.
          </div>
        ) : (
          // Tabela com área de rolagem para exibir as medições
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Peso (kg)</TableHead>
                  <TableHead>Peitoral</TableHead>
                  <TableHead>Cintura</TableHead>
                  <TableHead>Braços</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedMeasurements.map((measurement) => (
                  <TableRow key={measurement.id}>
                    <TableCell>
                      {format(new Date(measurement.date), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>{measurement.weight || '-'}</TableCell>
                    <TableCell>{measurement.chest || '-'}</TableCell>
                    <TableCell>{measurement.waist || '-'}</TableCell>
                    <TableCell>
                      {measurement.bicepsLeft || measurement.bicepsRight ? 
                        `${measurement.bicepsLeft || '-'}/${measurement.bicepsRight || '-'}` : 
                        '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {/* Botão de edição */}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(measurement)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        
                        {/* Diálogo de confirmação para exclusão */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir esta medição? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDelete(measurement.id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
      
      {/* Diálogo para edição de medição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Medição</DialogTitle>
            <DialogDescription>
              Atualize os valores da medição registrada.
            </DialogDescription>
          </DialogHeader>
          {editMeasurement && (
            <BodyMeasurementForm
              initialData={editMeasurement}
              onSave={handleUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default BodyMeasurementList;
