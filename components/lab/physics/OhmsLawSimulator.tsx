'use client';

import { useState } from 'react';
import { calculateCurrent, generateOhmsLawData } from '@/lib/lab/engines/physics-formulas';
import { OhmsLawData } from '@/types/lab';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Props {
  onComplete: (data: OhmsLawData) => void;
}

export default function OhmsLawSimulator({ onComplete }: Props) {
  const [voltage, setVoltage] = useState(5);
  const [resistance, setResistance] = useState(10);
  const [current, setCurrent] = useState(0);
  const [graphData, setGraphData] = useState<{ voltage: number; current: number }[]>([]);

  const calculate = () => {
    try {
      const i = calculateCurrent(voltage, resistance);
      setCurrent(i);
      
      const data = generateOhmsLawData(voltage, resistance);
      setGraphData(data);
      
      onComplete({ voltage, resistance, current: i, graphData: data });
    } catch (error) {
      alert('Error: ' + (error as Error).message);
    }
  };

  const chartData = {
    labels: graphData.map(d => d.voltage.toFixed(1)),
    datasets: [{
      label: 'Current (A)',
      data: graphData.map(d => d.current),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.1
    }]
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Voltage: {voltage}V</label>
            <Slider value={[voltage]} onValueChange={([v]) => setVoltage(v)} min={1} max={20} step={1} />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Resistance: {resistance}Ω</label>
            <Slider value={[resistance]} onValueChange={([v]) => setResistance(v)} min={1} max={100} step={1} />
          </div>

          <Button onClick={calculate} className="w-full">Calculate Current</Button>

          {current > 0 && (
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-lg font-semibold">Current: {current.toFixed(3)} A</p>
              <p className="text-sm text-gray-600 mt-1">I = V/R = {voltage}/{resistance}</p>
            </div>
          )}
        </div>

        <div>
          {graphData.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Voltage vs Current</h3>
              <Line data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
