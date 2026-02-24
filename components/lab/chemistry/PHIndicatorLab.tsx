'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'

interface PHData {
  solution: string
  ph: number
  color: string
  nature: string
  indicator: string
}

interface Props {
  onComplete: (data: PHData) => void
}

const solutions = [
  { name: 'Hydrochloric Acid (HCl)', ph: 1, nature: 'Strong Acid' },
  { name: 'Vinegar', ph: 3, nature: 'Weak Acid' },
  { name: 'Lemon Juice', ph: 2.5, nature: 'Acid' },
  { name: 'Coffee', ph: 5, nature: 'Weak Acid' },
  { name: 'Pure Water', ph: 7, nature: 'Neutral' },
  { name: 'Baking Soda Solution', ph: 9, nature: 'Weak Base' },
  { name: 'Soap Solution', ph: 10, nature: 'Base' },
  { name: 'Ammonia Solution', ph: 11, nature: 'Strong Base' },
  { name: 'Sodium Hydroxide (NaOH)', ph: 13, nature: 'Strong Base' },
]

const getColorFromPH = (ph: number): string => {
  if (ph < 3) return '#FF0000' // Red
  if (ph < 4) return '#FF4500' // Orange-Red
  if (ph < 5) return '#FFA500' // Orange
  if (ph < 6) return '#FFFF00' // Yellow
  if (ph < 7) return '#ADFF2F' // Yellow-Green
  if (ph === 7) return '#00FF00' // Green
  if (ph < 8) return '#40E0D0' // Turquoise
  if (ph < 10) return '#0000FF' // Blue
  if (ph < 12) return '#4B0082' // Indigo
  return '#8B00FF' // Violet
}

export default function PHIndicatorLab({ onComplete }: Props) {
  const [selectedSolution, setSelectedSolution] = useState('')
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<PHData | null>(null)
  const [dropAnimation, setDropAnimation] = useState(false)

  const testPH = () => {
    if (!selectedSolution) {
      alert('Please select a solution first')
      return
    }

    const solution = solutions.find((s) => s.name === selectedSolution)
    if (!solution) return

    setTesting(true)
    setDropAnimation(true)

    // Simulate adding indicator drops
    setTimeout(() => {
      setDropAnimation(false)
      
      const color = getColorFromPH(solution.ph)
      const data: PHData = {
        solution: solution.name,
        ph: solution.ph,
        color,
        nature: solution.nature,
        indicator: 'Universal Indicator',
      }

      setResult(data)
      setTesting(false)
      onComplete(data)
    }, 2000)
  }

  const reset = () => {
    setResult(null)
    setSelectedSolution('')
    setDropAnimation(false)
  }

  return (
    <div className="space-y-6">
      {/* Test Tube Display */}
      <div className="flex justify-center items-end gap-8 h-80">
        {/* Indicator Bottle */}
        <div className="relative">
          <div className="w-20 h-32 bg-gradient-to-b from-amber-800 to-amber-900 rounded-b-lg relative overflow-hidden border-2 border-amber-950">
            <div className="absolute top-0 left-0 right-0 h-4 bg-amber-700 rounded-t" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-xs text-white font-bold rotate-90 whitespace-nowrap">
              INDICATOR
            </div>
          </div>
          <div className="text-center mt-2 text-sm font-medium">Universal Indicator</div>
        </div>

        {/* Animated Drops */}
        {dropAnimation && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full animate-bounce"
                style={{
                  left: `${i * 10}px`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '1s',
                }}
              />
            ))}
          </div>
        )}

        {/* Test Tube */}
        <div className="relative">
          <div 
            className="w-24 h-64 rounded-b-3xl border-4 border-gray-300 relative overflow-hidden transition-all duration-1000"
            style={{
              background: result 
                ? `linear-gradient(to bottom, ${result.color}40, ${result.color})`
                : 'linear-gradient(to bottom, transparent, rgba(200, 200, 200, 0.3))',
            }}
          >
            {/* Liquid level animation */}
            {testing && (
              <div 
                className="absolute bottom-0 left-0 right-0 bg-blue-200 animate-pulse"
                style={{
                  height: '80%',
                  transition: 'all 2s ease-in-out',
                }}
              />
            )}

            {/* Bubbles animation */}
            {result && (
              <div className="absolute inset-0">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full opacity-40 animate-bounce"
                    style={{
                      left: `${20 + i * 15}%`,
                      bottom: `${Math.random() * 50}%`,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: `${2 + Math.random()}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="text-center mt-2 text-sm font-medium">Solution Sample</div>
        </div>

        {/* pH Scale Reference */}
        <div className="flex flex-col gap-1">
          <div className="text-xs font-bold mb-2">pH Scale</div>
          {[14, 12, 10, 8, 7, 6, 4, 2, 0].map((ph) => (
            <div key={ph} className="flex items-center gap-2">
              <div 
                className="w-6 h-4 rounded border border-gray-300"
                style={{ backgroundColor: getColorFromPH(ph) }}
              />
              <span className="text-xs font-mono w-6">{ph}</span>
              <span className="text-xs text-muted-foreground">
                {ph < 7 ? 'Acid' : ph === 7 ? 'Neutral' : 'Base'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Solution to Test</label>
          <Select value={selectedSolution} onValueChange={setSelectedSolution} disabled={testing}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a solution" />
            </SelectTrigger>
            <SelectContent>
              {solutions.map((s) => (
                <SelectItem key={s.name} value={s.name}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3">
          <Button onClick={testPH} disabled={testing || !selectedSolution} className="flex-1" size="lg">
            {testing ? '🧪 Testing...' : '🔬 Add Indicator & Test'}
          </Button>
          {result && (
            <Button onClick={reset} variant="outline" size="lg">
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      {result && !testing && (
        <div className="space-y-4 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
          <div className="text-center">
            <div 
              className="inline-block w-20 h-20 rounded-full shadow-lg border-4 border-white animate-pulse"
              style={{ backgroundColor: result.color }}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-sm text-muted-foreground">Solution</p>
              <p className="text-lg font-bold">{result.solution}</p>
            </div>

            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-sm text-muted-foreground">pH Value</p>
              <p className="text-3xl font-bold" style={{ color: result.color }}>
                {result.ph}
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-sm text-muted-foreground">Nature</p>
              <p className="text-lg font-bold text-purple-600">{result.nature}</p>
            </div>

            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-sm text-muted-foreground">Color Observed</p>
              <div className="flex items-center gap-2 mt-1">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: result.color }}
                />
                <p className="text-sm font-medium">
                  {result.ph < 7 ? 'Red/Orange' : result.ph === 7 ? 'Green' : 'Blue/Purple'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold mb-2 text-blue-800">📚 Did You Know?</h4>
            <p className="text-sm text-blue-700">
              {result.ph < 7 && 'Acids taste sour and turn blue litmus paper red. They react with metals to produce hydrogen gas.'}
              {result.ph === 7 && 'Pure water is neutral with pH 7. It has equal concentrations of H⁺ and OH⁻ ions.'}
              {result.ph > 7 && 'Bases taste bitter and feel slippery. They turn red litmus paper blue and neutralize acids.'}
            </p>
          </div>
        </div>
      )}

      {/* Information Panel */}
      <div className="p-4 bg-gray-50 rounded-lg border">
        <h4 className="font-semibold mb-2">🧪 About Universal Indicator:</h4>
        <p className="text-sm text-muted-foreground">
          Universal indicator is a mixture of dyes that shows different colors at different pH values. 
          It helps us identify whether a substance is acidic, neutral, or basic by observing the color change.
        </p>
        <div className="mt-3 text-xs space-y-1">
          <p>• <strong>Red/Orange (pH 0-4):</strong> Strong to weak acids</p>
          <p>• <strong>Yellow/Green (pH 5-6):</strong> Weak acids approaching neutral</p>
          <p>• <strong>Green (pH 7):</strong> Neutral solutions</p>
          <p>• <strong>Blue/Turquoise (pH 8-10):</strong> Weak to moderate bases</p>
          <p>• <strong>Purple/Violet (pH 11-14):</strong> Strong bases</p>
        </div>
      </div>
    </div>
  )
}
