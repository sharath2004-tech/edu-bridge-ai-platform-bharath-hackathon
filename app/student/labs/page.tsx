'use client'

import NeutralizationLab from '@/components/lab/chemistry/NeutralizationLab'
import PHIndicatorLab from '@/components/lab/chemistry/PHIndicatorLab'
import ReactivityLab from '@/components/lab/chemistry/ReactivityLab'
import OhmsLawSimulator from '@/components/lab/physics/OhmsLawSimulator'
import PendulumSimulation from '@/components/lab/physics/PendulumSimulation'
import ProjectileMotionLab from '@/components/lab/physics/ProjectileMotionLab'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Atom, Beaker, FlaskConical, Scale, Sparkles, Zap } from 'lucide-react'
import { useState } from 'react'

type ExperimentType = 'physics' | 'chemistry' | null
type LabType = 
  | 'pendulum' 
  | 'ohms-law' 
  | 'projectile' 
  | 'reactivity' 
  | 'neutralization' 
  | 'ph-indicator' 
  | null

export default function LabsPage() {
  const [selectedType, setSelectedType] = useState<ExperimentType>(null)
  const [selectedLab, setSelectedLab] = useState<LabType>(null)
  const [completedLabs, setCompletedLabs] = useState<string[]>([])

  const physicsLabs = [
    {
      id: 'pendulum',
      title: 'Pendulum Simulation',
      description: 'Study the relationship between pendulum length and period',
      icon: Scale,
      color: 'from-blue-500 to-cyan-500',
      difficulty: 'Beginner',
    },
    {
      id: 'ohms-law',
      title: "Ohm's Law Circuit",
      description: 'Explore voltage, current, and resistance relationships',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      difficulty: 'Intermediate',
    },
    {
      id: 'projectile',
      title: 'Projectile Motion',
      description: 'Analyze trajectory, range, and time of flight',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      difficulty: 'Advanced',
    },
  ]

  const chemistryLabs = [
    {
      id: 'reactivity',
      title: 'Metal Reactivity Series',
      description: 'Test metal reactions with acids and observe hydrogen gas',
      icon: Atom,
      color: 'from-green-500 to-emerald-500',
      difficulty: 'Beginner',
    },
    {
      id: 'neutralization',
      title: 'Acid-Base Neutralization',
      description: 'React acids with bases to form salt and water',
      icon: FlaskConical,
      color: 'from-red-500 to-pink-500',
      difficulty: 'Intermediate',
    },
    {
      id: 'ph-indicator',
      title: 'pH Indicators',
      description: 'Test solutions with universal indicator and observe color changes',
      icon: Beaker,
      color: 'from-indigo-500 to-purple-500',
      difficulty: 'Beginner',
    },
  ]

  const handleLabComplete = (labId: string, data: any) => {
    console.log('Lab completed:', labId, data)
    if (!completedLabs.includes(labId)) {
      setCompletedLabs([...completedLabs, labId])
    }
  }

  const resetLab = () => {
    setSelectedLab(null)
    setSelectedType(null)
  }

  // Render selected lab
  if (selectedLab) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="outline" 
            onClick={resetLab}
            className="mb-6"
          >
            ← Back to Labs
          </Button>

          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardTitle className="text-2xl">
                {selectedLab === 'pendulum' && 'Pendulum Simulation'}
                {selectedLab === 'ohms-law' && "Ohm's Law Circuit"}
                {selectedLab === 'projectile' && 'Projectile Motion'}
                {selectedLab === 'reactivity' && 'Metal Reactivity Series'}
                {selectedLab === 'neutralization' && 'Acid-Base Neutralization'}
                {selectedLab === 'ph-indicator' && 'pH Indicators'}
              </CardTitle>
              <CardDescription className="text-blue-100">
                Follow the instructions and complete the experiment
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {selectedLab === 'pendulum' && (
                <PendulumSimulation onComplete={(data: any) => handleLabComplete('pendulum', data)} />
              )}
              {selectedLab === 'ohms-law' && (
                <OhmsLawSimulator onComplete={(data: any) => handleLabComplete('ohms-law', data)} />
              )}
              {selectedLab === 'projectile' && (
                <ProjectileMotionLab onComplete={(data: any) => handleLabComplete('projectile', data)} />
              )}
              {selectedLab === 'reactivity' && (
                <ReactivityLab onComplete={(data: any) => handleLabComplete('reactivity', data)} />
              )}
              {selectedLab === 'neutralization' && (
                <NeutralizationLab onComplete={(data: any) => handleLabComplete('neutralization', data)} />
              )}
              {selectedLab === 'ph-indicator' && (
                <PHIndicatorLab onComplete={(data: any) => handleLabComplete('ph-indicator', data)} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Main labs selection page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🧪 Virtual Science Labs
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore interactive physics and chemistry experiments with real-time animations and instant results
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Experiments</p>
                  <p className="text-3xl font-bold text-green-600">{completedLabs.length}</p>
                </div>
                <Sparkles className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Available</p>
                  <p className="text-3xl font-bold text-blue-600">6</p>
                </div>
                <Beaker className="w-10 h-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {completedLabs.length > 0 ? '100%' : '0%'}
                  </p>
                </div>
                <Atom className="w-10 h-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Selection or Lab Grid */}
        {!selectedType ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Physics Card */}
            <Card 
              className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-blue-500"
              onClick={() => setSelectedType('physics')}
            >
              <CardHeader className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <div className="flex items-center gap-3">
                  <Zap className="w-8 h-8" />
                  <div>
                    <CardTitle className="text-2xl">Physics Experiments</CardTitle>
                    <CardDescription className="text-blue-100">
                      {physicsLabs.length} interactive simulations
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  Explore mechanics, electricity, and motion through interactive simulations
                </p>
                <div className="flex flex-wrap gap-2">
                  {physicsLabs.map((lab) => (
                    <span 
                      key={lab.id}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {lab.title}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chemistry Card */}
            <Card 
              className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-green-500"
              onClick={() => setSelectedType('chemistry')}
            >
              <CardHeader className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <div className="flex items-center gap-3">
                  <FlaskConical className="w-8 h-8" />
                  <div>
                    <CardTitle className="text-2xl">Chemistry Experiments</CardTitle>
                    <CardDescription className="text-green-100">
                      {chemistryLabs.length} interactive reactions
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  Perform reactions, test pH levels, and observe chemical changes safely
                </p>
                <div className="flex flex-wrap gap-2">
                  {chemistryLabs.map((lab) => (
                    <span 
                      key={lab.id}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {lab.title}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {selectedType === 'physics' ? (
                  <>
                    <Zap className="w-6 h-6 text-blue-500" />
                    Physics Experiments
                  </>
                ) : (
                  <>
                    <FlaskConical className="w-6 h-6 text-green-500" />
                    Chemistry Experiments
                  </>
                )}
              </h2>
              <Button variant="outline" onClick={() => setSelectedType(null)}>
                ← Back to Categories
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {(selectedType === 'physics' ? physicsLabs : chemistryLabs).map((lab) => {
                const Icon = lab.icon
                const isCompleted = completedLabs.includes(lab.id)
                
                return (
                  <Card 
                    key={lab.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                    onClick={() => setSelectedLab(lab.id as LabType)}
                  >
                    {isCompleted && (
                      <div className="absolute top-2 right-2 z-10">
                        <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          ✓ Completed
                        </div>
                      </div>
                    )}
                    
                    <CardHeader className={`bg-gradient-to-br ${lab.color} text-white`}>
                      <div className="flex items-center justify-between">
                        <Icon className="w-12 h-12" />
                        <span className="text-xs bg-white/20 px-2 py-1 rounded">
                          {lab.difficulty}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-2">{lab.title}</h3>
                      <p className="text-sm text-muted-foreground">{lab.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
