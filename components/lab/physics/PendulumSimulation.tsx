'use client';

import { useEffect, useState } from 'react';
import { PendulumData } from '@/types/lab';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface Props {
  onComplete: (data: PendulumData) => void;
  whatIfMode?: boolean;
}

export default function PendulumSimulation({ onComplete, whatIfMode = false }: Props) {
  const [length, setLength] = useState(1);
  const [angle, setAngle] = useState(0);
  const [gravity, setGravity] = useState(9.81);
  const [isSwinging, setIsSwinging] = useState(false);
  const [period, setPeriod] = useState(0);

  const calculatePeriod = () => {
    const theoretical = 2 * Math.PI * Math.sqrt(length / gravity);
    const simulated = theoretical * (1 + (Math.random() - 0.5) * 0.05); // 5% variation
    setPeriod(simulated);
    
    const error = Math.abs(((simulated - theoretical) / theoretical) * 100);
    
    onComplete({
      length,
      angle: angle || 15,
      simulatedPeriod: simulated,
      theoreticalPeriod: theoretical,
      error,
      gravity
    });
  };

  const startSwing = () => {
    setIsSwinging(true);
    setTimeout(() => {
      calculatePeriod();
      setIsSwinging(false);
    }, 3000);
  };

  const swingDuration = 2 * Math.PI * Math.sqrt(length / gravity);

  return (
    <div className="space-y-6">
      <div className="relative h-96 bg-gradient-to-b from-sky-100 to-white rounded-lg overflow-hidden border">
        <div className="absolute top-8 left-1/2 w-2 h-2 bg-gray-800 rounded-full -translate-x-1/2" />
        
        <div
          className="absolute top-8 left-1/2 origin-top transition-transform"
          style={{
            height: `${length * 150}px`,
            transform: `translateX(-50%) rotate(${isSwinging ? 0 : angle}deg)`,
            animation: isSwinging ? `swing ${swingDuration}s ease-in-out infinite` : 'none'
          }}
        >
          <div className="w-0.5 h-full bg-gray-600" />
          <div className="absolute bottom-0 left-1/2 w-8 h-8 bg-blue-500 rounded-full -translate-x-1/2 shadow-lg" />
        </div>
      </div>

      <style jsx>{`
        @keyframes swing {
          0%, 100% { transform: translateX(-50%) rotate(${angle || 15}deg); }
          50% { transform: translateX(-50%) rotate(-${angle || 15}deg); }
        }
      `}</style>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Length: {length.toFixed(2)}m</label>
          <Slider value={[length]} onValueChange={([v]) => setLength(v)} min={0.3} max={2} step={0.1} disabled={isSwinging} />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Initial Angle: {angle}°</label>
          <Slider value={[angle]} onValueChange={([v]) => setAngle(v)} min={0} max={45} step={5} disabled={isSwinging} />
        </div>

        {whatIfMode && (
          <div>
            <label className="block text-sm font-medium mb-2">Gravity: {gravity.toFixed(2)} m/s²</label>
            <Slider value={[gravity]} onValueChange={([v]) => setGravity(v)} min={1} max={20} step={0.5} disabled={isSwinging} />
          </div>
        )}

        <Button onClick={startSwing} disabled={isSwinging} className="w-full">
          {isSwinging ? '⏱️ Measuring...' : '▶️ Start Experiment'}
        </Button>

        {period > 0 && !isSwinging && (
          <div className="p-4 bg-blue-50 rounded-lg space-y-2">
            <p className="font-semibold">Measured Period: {period.toFixed(3)}s</p>
            <p className="text-sm text-gray-600">
              Theoretical: {(2 * Math.PI * Math.sqrt(length / gravity)).toFixed(3)}s
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
