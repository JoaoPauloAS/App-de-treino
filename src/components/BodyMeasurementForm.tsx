
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BodyMeasurement } from '@/types/workout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';

interface BodyMeasurementFormProps {
  onSave: (measurement: BodyMeasurement) => void;
  initialData?: BodyMeasurement;
}

const BodyMeasurementForm: React.FC<BodyMeasurementFormProps> = ({ onSave, initialData }) => {
  const [date, setDate] = useState<Date>(initialData?.date || new Date());
  const [weight, setWeight] = useState<string>(initialData?.weight?.toString() || '');
  const [height, setHeight] = useState<string>(initialData?.height?.toString() || '');
  const [chest, setChest] = useState<string>(initialData?.chest?.toString() || '');
  const [waist, setWaist] = useState<string>(initialData?.waist?.toString() || '');
  const [hips, setHips] = useState<string>(initialData?.hips?.toString() || '');
  const [bicepsLeft, setBicepsLeft] = useState<string>(initialData?.bicepsLeft?.toString() || '');
  const [bicepsRight, setBicepsRight] = useState<string>(initialData?.bicepsRight?.toString() || '');
  const [thighLeft, setThighLeft] = useState<string>(initialData?.thighLeft?.toString() || '');
  const [thighRight, setThighRight] = useState<string>(initialData?.thighRight?.toString() || '');
  const [calfLeft, setCalfLeft] = useState<string>(initialData?.calfLeft?.toString() || '');
  const [calfRight, setCalfRight] = useState<string>(initialData?.calfRight?.toString() || '');
  const [notes, setNotes] = useState<string>(initialData?.notes || '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const measurement: BodyMeasurement = {
      id: initialData?.id || uuidv4(),
      date,
      weight: weight ? parseFloat(weight) : undefined,
      height: height ? parseFloat(height) : undefined,
      chest: chest ? parseFloat(chest) : undefined,
      waist: waist ? parseFloat(waist) : undefined,
      hips: hips ? parseFloat(hips) : undefined,
      bicepsLeft: bicepsLeft ? parseFloat(bicepsLeft) : undefined,
      bicepsRight: bicepsRight ? parseFloat(bicepsRight) : undefined,
      thighLeft: thighLeft ? parseFloat(thighLeft) : undefined,
      thighRight: thighRight ? parseFloat(thighRight) : undefined,
      calfLeft: calfLeft ? parseFloat(calfLeft) : undefined,
      calfRight: calfRight ? parseFloat(calfRight) : undefined,
      notes
    };
    
    onSave(measurement);
    
    // Limpar formulário
    if (!initialData) {
      setWeight('');
      setHeight('');
      setChest('');
      setWaist('');
      setHips('');
      setBicepsLeft('');
      setBicepsRight('');
      setThighLeft('');
      setThighRight('');
      setCalfLeft('');
      setCalfRight('');
      setNotes('');
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Editar' : 'Nova'} Medição Corporal</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="date">Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  locale={ptBR}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ex: 75.5"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="height">Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Ex: 175"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label htmlFor="chest">Peitoral (cm)</Label>
              <Input
                id="chest"
                type="number"
                step="0.1"
                value={chest}
                onChange={(e) => setChest(e.target.value)}
                placeholder="Ex: 95"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="waist">Cintura (cm)</Label>
              <Input
                id="waist"
                type="number"
                step="0.1"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                placeholder="Ex: 82"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="hips">Quadril (cm)</Label>
              <Input
                id="hips"
                type="number"
                step="0.1"
                value={hips}
                onChange={(e) => setHips(e.target.value)}
                placeholder="Ex: 100"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="bicepsLeft">Bíceps Esquerdo (cm)</Label>
              <Input
                id="bicepsLeft"
                type="number"
                step="0.1"
                value={bicepsLeft}
                onChange={(e) => setBicepsLeft(e.target.value)}
                placeholder="Ex: 35"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="bicepsRight">Bíceps Direito (cm)</Label>
              <Input
                id="bicepsRight"
                type="number"
                step="0.1"
                value={bicepsRight}
                onChange={(e) => setBicepsRight(e.target.value)}
                placeholder="Ex: 36"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="thighLeft">Coxa Esquerda (cm)</Label>
              <Input
                id="thighLeft"
                type="number"
                step="0.1"
                value={thighLeft}
                onChange={(e) => setThighLeft(e.target.value)}
                placeholder="Ex: 60"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="thighRight">Coxa Direita (cm)</Label>
              <Input
                id="thighRight"
                type="number"
                step="0.1"
                value={thighRight}
                onChange={(e) => setThighRight(e.target.value)}
                placeholder="Ex: 60"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="calfLeft">Panturrilha Esquerda (cm)</Label>
              <Input
                id="calfLeft"
                type="number"
                step="0.1"
                value={calfLeft}
                onChange={(e) => setCalfLeft(e.target.value)}
                placeholder="Ex: 38"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="calfRight">Panturrilha Direita (cm)</Label>
              <Input
                id="calfRight"
                type="number"
                step="0.1"
                value={calfRight}
                onChange={(e) => setCalfRight(e.target.value)}
                placeholder="Ex: 38"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="notes">Anotações</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações adicionais..."
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            {initialData ? 'Atualizar' : 'Salvar'} Medição
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default BodyMeasurementForm;
