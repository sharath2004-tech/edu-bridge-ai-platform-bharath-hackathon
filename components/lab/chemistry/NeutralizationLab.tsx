'use client';

import { useState } from 'react';
import { getReaction } from '@/lib/lab/engines/chemistry-reactions';
import { NeutralizationData } from '@/types/lab';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  onComplete: (data: NeutralizationData) => void;
}

export default function NeutralizationLab({ onComplete }: Props) {
  const [acid, setAcid] = useState('');
  const [base, setBase] = useState('');
  const [result, setResult] = useState<NeutralizationData | null>(null);
  const [animating, setAnimating] = useState(false);

  const acids = ['HCl', 'H₂SO₄', 'CH₃COOH'];
  const bases = ['NaOH', 'NH₄OH'];

  const performReaction = () => {
    if (!acid || !base) {
      alert('Please select both acid and base');
      return;
    }

    const reaction = getReaction(acid, base);
    if (!reaction) {
      alert('Reaction not found in database');
      return;
    }

    setAnimating(true);
    setTimeout(() => {
      const data: NeutralizationData = {
        acid,
        base,
        balancedEquation: reaction.equation,
        reactionType: reaction.type,
        temperatureChange: reaction.temperatureChange,
        initialPH: reaction.phChange.initial,
        finalPH: reaction.phChange.final,
        products: reaction.products
      };
      
      setResult(data);
      setAnimating(false);
      onComplete(data);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
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

        <div>
          <label className="block text-sm font-medium mb-2">Select Base</label>
          <Select value={base} onValueChange={setBase}>
            <SelectTrigger>
              <SelectValue placeholder="Choose base" />
            </SelectTrigger>
            <SelectContent>
              {bases.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={performReaction} disabled={animating} className="w-full">
        {animating ? 'Reacting...' : 'Perform Reaction'}
      </Button>

      {animating && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-pulse text-4xl">⚗️ 🔥 💧</div>
        </div>
      )}

      {result && !animating && (
        <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg">
          <div>
            <h3 className="font-semibold text-lg mb-2">Balanced Equation</h3>
            <p className="text-xl font-mono">{result.balancedEquation}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-3 bg-white rounded">
              <p className="text-sm text-gray-600">Reaction Type</p>
              <p className="font-semibold">{result.reactionType}</p>
            </div>
            <div className="p-3 bg-white rounded">
              <p className="text-sm text-gray-600">Temperature Change</p>
              <p className="font-semibold text-red-600">+{result.temperatureChange}°C</p>
            </div>
            <div className="p-3 bg-white rounded">
              <p className="text-sm text-gray-600">Initial pH</p>
              <p className="font-semibold">{result.initialPH}</p>
            </div>
            <div className="p-3 bg-white rounded">
              <p className="text-sm text-gray-600">Final pH</p>
              <p className="font-semibold text-green-600">{result.finalPH}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Products Formed</h4>
            <div className="flex gap-2">
              {result.products.map(p => (
                <span key={p} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
