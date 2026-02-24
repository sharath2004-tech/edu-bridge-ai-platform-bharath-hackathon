'use client'

import NeutralizationLab from '@/components/lab/chemistry/NeutralizationLab'
import PHIndicatorLab from '@/components/lab/chemistry/PHIndicatorLab'
import ReactivityLab from '@/components/lab/chemistry/ReactivityLab'
import OhmsLawSimulator from '@/components/lab/physics/OhmsLawSimulator'
import PendulumSimulation from '@/components/lab/physics/PendulumSimulation'
import ProjectileMotionLab from '@/components/lab/physics/ProjectileMotionLab'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Atom, Beaker, FlaskConical, Scale, Sparkles, Zap } from 'lucide-react'
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
    const labTitles = {
      'pendulum': 'Pendulum Simulation',
      'ohms-law': "Ohm's Law Circuit",
      'projectile': 'Projectile Motion',
      'reactivity': 'Metal Reactivity Series',
      'neutralization': 'Acid-Base Neutralization',
      'ph-indicator': 'pH Indicators'
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={resetLab}
              className="hover:bg-slate-100"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Labs
            </Button>
            
            {completedLabs.includes(selectedLab) && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Experiment Completed</span>
              </div>
            )}
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white pb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Beaker className="w-8 h-8" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold mb-2">
                    {labTitles[selectedLab]}
                  </CardTitle>
                  <CardDescription className="text-white/90 text-base">
                    Follow the steps below to complete your virtual experiment
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 bg-white">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto p-6 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold text-gray-900">
            Virtual Science Labs
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore interactive physics and chemistry experiments with real-time animations and instant results
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-gray-900">{completedLabs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Beaker className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Labs</p>
                  <p className="text-3xl font-bold text-gray-900">6</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Atom className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Success Rate</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {completedLabs.length > 0 ? '100%' : '0%'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Selection or Lab Grid */}
        {!selectedType ? (
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {/* Physics Card */}
            <Card 
              className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              onClick={() => setSelectedType('physics')}
            >
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 group-hover:bg-transparent transition-colors duration-300">
                  <CardHeader className="pb-6 pt-8">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-600 group-hover:bg-white/20 rounded-2xl flex items-center justify-center transition-colors duration-300">
                          <Zap className="w-9 h-9 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-3xl font-bold text-slate-900 group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">
                            Physics
                          </CardTitle>
                          <CardDescription className="text-slate-700 font-medium group-hover:text-white group-hover:drop-shadow transition-all duration-300 mt-1">
                            {physicsLabs.length} experiments available
                          </CardDescription>
                        </div>
                      </div>
                      <ArrowRight className="w-6 h-6 text-blue-600 group-hover:text-white group-hover:translate-x-1 group-hover:drop-shadow transition-all duration-300" />
                    </div>
                  </CardHeader>
                  <CardContent className="pb-8">
                    <p className="text-slate-800 font-medium group-hover:text-white group-hover:drop-shadow transition-all duration-300 text-base leading-relaxed">
                      Explore mechanics, electricity, and motion through interactive simulations and real-time calculations
                    </p>
                  </CardContent>
                </div>
              </div>
            </Card>

            {/* Chemistry Card */}
            <Card 
              className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              onClick={() => setSelectedType('chemistry')}
            >
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-500 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 group-hover:bg-transparent transition-colors duration-300">
                  <CardHeader className="pb-6 pt-8">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-green-600 group-hover:bg-white/20 rounded-2xl flex items-center justify-center transition-colors duration-300">
                          <FlaskConical className="w-9 h-9 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-3xl font-bold text-slate-900 group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">
                            Chemistry
                          </CardTitle>
                          <CardDescription className="text-slate-700 font-medium group-hover:text-white group-hover:drop-shadow transition-all duration-300 mt-1">
                            {chemistryLabs.length} experiments available
                          </CardDescription>
                        </div>
                      </div>
                      <ArrowRight className="w-6 h-6 text-green-600 group-hover:text-white group-hover:translate-x-1 group-hover:drop-shadow transition-all duration-300" />
                    </div>
                  </CardHeader>
                  <CardContent className="pb-8">
                    <p className="text-slate-800 font-medium group-hover:text-white group-hover:drop-shadow transition-all duration-300 text-base leading-relaxed">
                      Perform reactions, test pH levels, and observe chemical changes in a safe virtual environment
                    </p>
                  </CardContent>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <button onClick={() => setSelectedType(null)} className="hover:text-indigo-600 transition-colors">
                Science Labs
              </button>
              <span>/</span>
              <span className="text-gray-900 font-medium">
                {selectedType === 'physics' ? 'Physics' : 'Chemistry'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  {selectedType === 'physics' ? (
                    <>
                      <Zap className="w-10 h-10 text-blue-600" />
                      Physics Labs
                    </>
                  ) : (
                    <>
                      <FlaskConical className="w-10 h-10 text-green-600" />
                      Chemistry Labs
                    </>
                  )}
                </h2>
                <p className="text-gray-600">
                  {(selectedType === 'physics' ? physicsLabs : chemistryLabs).length} experiments available
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSelectedType(null)}
                className="hover:bg-slate-100"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {(selectedType === 'physics' ? physicsLabs : chemistryLabs).map((lab) => {
                const Icon = lab.icon
                const isCompleted = completedLabs.includes(lab.id)
                
                return (
                  <Card 
                    key={lab.id}
                    className="group cursor-pointer border-0 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
                    onClick={() => setSelectedLab(lab.id as LabType)}
                  >
                    <div className={`h-2 ${selectedType === 'physics' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`} />
                    
                    <CardHeader className="bg-white pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${selectedType === 'physics' ? 'bg-blue-50' : 'bg-green-50'}`}>
                          <Icon className={`w-8 h-8 ${selectedType === 'physics' ? 'text-blue-600' : 'text-green-600'}`} />
                        </div>
                        {isCompleted && (
                          <div className="bg-green-500 text-white rounded-full p-1.5 shadow-lg">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-xl mb-2 group-hover:text-indigo-600 transition-colors">
                        {lab.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">
                          {lab.duration || '10-15 min'}
                        </span>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          lab.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                          lab.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {lab.difficulty}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 pb-6">
                      <p className="text-gray-600 text-sm leading-relaxed">{lab.description}</p>
                      <Button 
                        className={`w-full mt-4 ${
                          selectedType === 'physics'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                            : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                        } text-white shadow-lg group-hover:shadow-xl transition-all`}
                      >
                        Start Experiment
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
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
