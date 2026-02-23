'use client';

import { useState } from 'react';
import { checkMetalReactivity, REACTIVITY_SERIES } from '@/lib/lab/engines/chemistry-reactions';
import { ReactivityData } from '@/types/lab';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  onComplete: (data: ReactivityData) => void;
}

export default function ReactivityLab({ onComplete }: Props) {
  const [metal, setMetal] = useState('');
  const [acid, setAcid] = useState('');
  const [result, setResult] = useState<ReactivityData | null>(null);
  const [bubbling, setBubbling] = useState(false);

  const metals = REACTIVITY_SERIES.map(m => m.metal);
  const acids = ['HCl', 'H₂SO₄', 'HNO₃'];

  const testReactivity = () => {
    if (!metal || !acid) {
      alert('Please select both metal and acid');
      return;
    }

    const reactionResult = checkMetalReactivity(metal, acid);
    
    const data: ReactivityData = {
      metal,
      acid,
      reactionOccurs: reactionResult.reactionOccurs,
      hydrogenReleased: reactionResult.hydrogenReleased,
      reactivityPosition: reactionResult.reactivityPosition,
      observation: reactionResult.observation
    };

    setResult(data);
    
    if (data.hydrogenReleased) {
      setBubbling(true);
      setTimeout(() => setBubbling(false), 3000);
    }
    
    onComplete(data);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Metal</label>
          <Select value={metal} onValueChange={setMetal}>
            <SelectTrigger>
              <SelectValue placeholder="Choose metal" />
            </SelectTrigger>
            <SelectContent>
              {metals.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Select Acid</label>
          <Select value={acid} onValueChange={setAcid}>
            <SelectTrigger>
              <SelectValue placeholder="Choose acid" />
            </SelectTrigger>
            <SelectContent>
              {acids.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={testReactivity} className="w-full">Test Reactivity</Button>

      {bubbling && (
        <div className="relative h-48 bg-gradient-to-t from-blue-100 to-transparent rounded-lg overflow-hidden">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 bg-blue-400 rounded-full animate-bounce opacity-70"
                style={{
                  left: `${Math.random() * 100 - 50}px`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '2s'
                }}
              >
                💨
              </div>
            ))}
          </div>
          <p className="text-center pt-4 font-semibold text-blue-700">Hydrogen gas bubbles! 🧪</p>
        </div>
      )}

      {result && (
        <div className={`p-6 rounded-lg ${result.reactionOccurs ? 'bg-green-50' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">{result.reactionOccurs ? '✅' : '❌'}</span>
            <h3 className="text-lg font-semibold">
              {result.reactionOccurs ? 'Reaction Occurs!' : 'No Reaction'}
            </h3>
          </div>

          <p className="text-gray-700 mb-4">{result.observation}</p>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded">
              <p className="text-sm text-gray-600">Metal Position</p>
              <p className="font-semibold">#{result.reactivityPosition} in series</p>
            </div>
            <div className="p-3 bg-white rounded">
              <p className="text-sm text-gray-600">Hydrogen Released</p>
              <p className="font-semibold">{result.hydrogenReleased ? 'Yes' : 'No'}</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded">
            <p className="text-sm font-semibold mb-2">Reactivity Series (Most → Least)</p>
            <div className="flex flex-wrap gap-2">
              {REACTIVITY_SERIES.slice(0, 5).map(m => (
                <span
                  key={m.metal}
                  className={`px-2 py-1 rounded text-xs ${
                    m.metal === metal ? 'bg-blue-600 text-white' : 'bg-white'
                  }`}
                >
                  {m.metal}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
