
import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

interface RestTimerProps {
  minutes: number;
  onComplete: () => void;
  onChangeTime: (minutes: number) => void;
}

const RestTimer: React.FC<RestTimerProps> = ({ minutes, onComplete, onChangeTime }) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [restMinutes, setRestMinutes] = useState(minutes);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      onComplete();
    }
    
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(restMinutes * 60);
  };

  const handleChangeTime = (value: number[]) => {
    const newMinutes = value[0];
    setRestMinutes(newMinutes);
    setTimeLeft(newMinutes * 60);
    onChangeTime(newMinutes);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-workout-background border-2 border-workout-secondary">
      <CardContent className="pt-4">
        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold mb-4 flex items-center gap-2">
            <Timer className="h-6 w-6 text-workout-secondary" />
            <span className="text-workout-secondary">{formatTime(timeLeft)}</span>
          </div>
          
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
