
/**
 * @file RestTimer.tsx
 * @description Cronômetro para controlar o tempo de descanso entre séries
 * Permite definir, iniciar, pausar e reiniciar o cronômetro
 */

import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

/**
 * Interface de props do componente
 * @property {number} minutes - Tempo inicial em minutos
 * @property {Function} onComplete - Função callback para quando o timer terminar
 * @property {Function} onChangeTime - Função callback para quando o tempo for alterado
 */
interface RestTimerProps {
  minutes: number;
  onComplete: () => void;
  onChangeTime: (minutes: number) => void;
}

/**
 * Componente de timer para controlar tempos de descanso
 * Oferece controles de iniciar, pausar e reiniciar, além de ajuste de tempo
 * 
 * @param {RestTimerProps} props - Propriedades do componente
 * @returns {JSX.Element} Interface do cronômetro de descanso
 */
const RestTimer: React.FC<RestTimerProps> = ({ minutes, onComplete, onChangeTime }) => {
  // Estado para rastrear o tempo restante em segundos
  const [timeLeft, setTimeLeft] = useState(minutes * 60);
  // Estado para controlar se o timer está em execução
  const [isRunning, setIsRunning] = useState(false);
  // Estado para armazenar o tempo configurado em minutos
  const [restMinutes, setRestMinutes] = useState(minutes);

  /**
   * Efeito para gerenciar o timer
   * Decrementa o tempo a cada segundo quando ativo
   */
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    // Se o timer estiver rodando e ainda tiver tempo
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Quando o tempo acabar, para o timer e notifica
      setIsRunning(false);
      onComplete();
    }
    
    // Limpa o interval quando o componente for desmontado
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onComplete]);

  /**
   * Alterna o estado de execução do timer (play/pause)
   */
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  /**
   * Reinicia o timer com o tempo configurado
   */
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(restMinutes * 60);
  };

  /**
   * Manipula a mudança no tempo de descanso via slider
   * @param {number[]} value - Novo valor em minutos (array do slider)
   */
  const handleChangeTime = (value: number[]) => {
    const newMinutes = value[0];
    setRestMinutes(newMinutes);
    setTimeLeft(newMinutes * 60);
    onChangeTime(newMinutes);
  };

  /**
   * Formata o tempo em segundos para exibição (MM:SS)
   * @param {number} seconds - Tempo em segundos
   * @returns {string} Tempo formatado como MM:SS
   */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-workout-background border-2 border-workout-secondary">
      <CardContent className="pt-4">
        <div className="flex flex-col items-center">
          {/* Exibição do tempo restante */}
          <div className="text-3xl font-bold mb-4 flex items-center gap-2">
            <Timer className="h-6 w-6 text-workout-secondary" />
            <span className="text-workout-secondary">{formatTime(timeLeft)}</span>
          </div>
          
          {/* Slider para ajustar o tempo de descanso */}
          <div className="w-full mb-4">
            <div className="text-sm text-gray-500 mb-2">Tempo de descanso (min): {restMinutes}</div>
            <Slider
              value={[restMinutes]}
              min={0.5}
              max={10}
              step={0.5}
              onValueChange={handleChangeTime}
              className="w-full"
            />
          </div>
          
          {/* Botões de controle do timer */}
          <div className="flex gap-2">
            <Button
              onClick={toggleTimer}
              variant="outline"
              className="flex items-center gap-1"
            >
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isRunning ? 'Pausar' : 'Iniciar'}
            </Button>
            
            <Button
              onClick={resetTimer}
              variant="outline"
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Reiniciar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RestTimer;
