'use client'

import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useState } from 'react'

interface ProjectileData {
  initialVelocity: number
  angle: number
  height: number
  range: number
  maxHeight: number
  timeOfFlight: number
  trajectory: { x: number; y: number }[]
}

interface Props {
  onComplete: (data: ProjectileData) => void
}

export default function ProjectileMotionLab({ onComplete }: Props) {
  const [velocity, setVelocity] = useState(20)
  const [angle, setAngle] = useState(45)
  const [isLaunched, setIsLaunched] = useState(false)
  const [projectilePos, setProjectilePos] = useState({ x: 0, y: 0 })
  const [result, setResult] = useState<ProjectileData | null>(null)

  const g = 9.81 // gravity

  const calculateTrajectory = () => {
    const angleRad = (angle * Math.PI) / 180
    const vx = velocity * Math.cos(angleRad)
    const vy = velocity * Math.sin(angleRad)

    // Time of flight
    const timeOfFlight = (2 * vy) / g

    // Maximum height
    const maxHeight = (vy * vy) / (2 * g)

    // Range
    const range = vx * timeOfFlight

    // Generate trajectory points
    const trajectory: { x: number; y: number }[] = []
    const steps = 50
    for (let i = 0; i <= steps; i++) {
      const t = (timeOfFlight * i) / steps
      const x = vx * t
      const y = vy * t - 0.5 * g * t * t
      if (y >= 0) {
        trajectory.push({ x, y })
      }
    }

    return {
      initialVelocity: velocity,
      angle,
      height: maxHeight,
      range,
      maxHeight,
      timeOfFlight,
      trajectory,
    }
  }

  const launch = () => {
    const data = calculateTrajectory()
    setResult(data)
    setIsLaunched(true)

    // Animate projectile
    const duration = data.timeOfFlight * 1000
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      if (progress < 1) {
        const index = Math.floor(progress * (data.trajectory.length - 1))
        setProjectilePos(data.trajectory[index])
        requestAnimationFrame(animate)
      } else {
        setProjectilePos(data.trajectory[data.trajectory.length - 1])
        setTimeout(() => {
          setIsLaunched(false)
          setProjectilePos({ x: 0, y: 0 })
        }, 1000)
        onComplete(data)
      }
    }

    animate()
  }

  return (
    <div className="space-y-6">
      {/* Simulation Canvas */}
      <div className="relative h-80 bg-gradient-to-b from-sky-200 via-sky-100 to-green-100 rounded-lg overflow-hidden border-2 border-gray-300">
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-green-600 to-green-800" />

        {/* Trajectory Path */}
        {result && !isLaunched && (
          <svg className="absolute inset-0 w-full h-full" style={{ transform: 'scaleY(-1)' }}>
            <path
              d={`M ${result.trajectory.map((p, i) => 
                `${(p.x / result.range) * 90 + 5},${(p.y / result.maxHeight) * 70 + 10}`
              ).join(' L ')}`}
              stroke="rgba(59, 130, 246, 0.5)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
            />
          </svg>
        )}

        {/* Cannon */}
        <div 
          className="absolute bottom-8 left-8 w-12 h-12 origin-center"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <div className="w-full h-4 bg-gradient-to-r from-gray-700 to-gray-900 rounded-r-full" />
          <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gray-800 rounded-full border-4 border-gray-900" />
        </div>

        {/* Projectile */}
        {isLaunched && result && (
          <div
            className="absolute w-6 h-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-full shadow-lg transition-all duration-75"
            style={{
              left: `${(projectilePos.x / result.range) * 90 + 5}%`,
              bottom: `${(projectilePos.y / result.maxHeight) * 70 + 10}%`,
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.8)',
            }}
          >
            <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75" />
          </div>
        )}

        {/* Launch Effect */}
        {isLaunched && projectilePos.x === 0 && (
          <div className="absolute bottom-8 left-8 animate-pulse">
            <div className="text-4xl">💥</div>
          </div>
        )}

        {/* Landing Effect */}
        {result && !isLaunched && projectilePos.x === 0 && (
          <div 
            className="absolute bottom-8 animate-bounce"
            style={{ left: `${90 + 5}%` }}
          >
            <div className="text-2xl">🎯</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Initial Velocity: {velocity} m/s
          </label>
          <Slider
            value={[velocity]}
            onValueChange={([v]) => setVelocity(v)}
            min={5}
            max={50}
            step={1}
            disabled={isLaunched}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Launch Angle: {angle}°
          </label>
          <Slider
            value={[angle]}
            onValueChange={([a]) => setAngle(a)}
            min={15}
            max={75}
            step={5}
            disabled={isLaunched}
          />
        </div>

        <Button onClick={launch} disabled={isLaunched} className="w-full" size="lg">
          {isLaunched ? '🚀 In Flight...' : '🎯 Launch Projectile'}
        </Button>
      </div>

      {/* Results */}
      {result && !isLaunched && (
        <div className="grid md:grid-cols-2 gap-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
          <div className="p-3 bg-white rounded-lg shadow">
            <p className="text-sm text-muted-foreground">Range</p>
            <p className="text-2xl font-bold text-blue-600">{result.range.toFixed(2)} m</p>
          </div>

          <div className="p-3 bg-white rounded-lg shadow">
            <p className="text-sm text-muted-foreground">Max Height</p>
            <p className="text-2xl font-bold text-green-600">{result.maxHeight.toFixed(2)} m</p>
          </div>

          <div className="p-3 bg-white rounded-lg shadow">
            <p className="text-sm text-muted-foreground">Time of Flight</p>
            <p className="text-2xl font-bold text-purple-600">{result.timeOfFlight.toFixed(2)} s</p>
          </div>

          <div className="p-3 bg-white rounded-lg shadow">
            <p className="text-sm text-muted-foreground">Initial Velocity</p>
            <p className="text-2xl font-bold text-orange-600">{result.initialVelocity} m/s</p>
          </div>
        </div>
      )}

      {/* Formulas */}
      <div className="p-4 bg-gray-50 rounded-lg border">
        <h4 className="font-semibold mb-2">📐 Physics Formulas Used:</h4>
        <div className="space-y-1 text-sm font-mono">
          <p>• Range = v₀² × sin(2θ) / g</p>
          <p>• Max Height = v₀² × sin²(θ) / (2g)</p>
          <p>• Time of Flight = 2v₀ × sin(θ) / g</p>
          <p>• Trajectory: y = x×tan(θ) - (gx²) / (2v₀²cos²(θ))</p>
        </div>
      </div>
    </div>
  )
}
