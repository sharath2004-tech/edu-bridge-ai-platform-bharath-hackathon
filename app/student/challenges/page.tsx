'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import TugOfWar from '@/components/lab/games/TugOfWar'
import RacingGame from '@/components/lab/games/RacingGame'
import { useState } from 'react'
import { Trophy, Gamepad2, Brain, Zap, ArrowLeft, Car } from 'lucide-react'

// Sample quiz questions
const sampleQuestions = [
  {
    id: '1',
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2
  },
  {
    id: '2',
    question: 'What is 15 × 8?',
    options: ['120', '125', '115', '130'],
    correctAnswer: 0
  },
  {
    id: '3',
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 1
  },
  {
    id: '4',
    question: 'What is the chemical symbol for water?',
    options: ['H2O', 'CO2', 'O2', 'N2'],
    correctAnswer: 0
  },
  {
    id: '5',
    question: 'Who wrote "Romeo and Juliet"?',
    options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
    correctAnswer: 1
  },
  {
    id: '6',
    question: 'What is the largest ocean on Earth?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
    correctAnswer: 3
  },
  {
    id: '7',
    question: 'How many continents are there?',
    options: ['5', '6', '7', '8'],
    correctAnswer: 2
  },
  {
    id: '8',
    question: 'What is the speed of light?',
    options: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '200,000 km/s'],
    correctAnswer: 0
  }
]

const mathQuestions = [
  {
    id: 'm1',
    question: 'What is 144 ÷ 12?',
    options: ['10', '11', '12', '13'],
    correctAnswer: 2
  },
  {
    id: 'm2',
    question: 'What is the square root of 169?',
    options: ['11', '12', '13', '14'],
    correctAnswer: 2
  },
  {
    id: 'm3',
    question: 'What is 7³?',
    options: ['343', '349', '337', '351'],
    correctAnswer: 0
  },
  {
    id: 'm4',
    question: 'What is 25% of 80?',
    options: ['15', '20', '25', '30'],
    correctAnswer: 1
  }
]

const scienceQuestions = [
  {
    id: 's1',
    question: 'What is the powerhouse of the cell?',
    options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'],
    correctAnswer: 1
  },
  {
    id: 's2',
    question: 'What gas do plants absorb from the atmosphere?',
    options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
    correctAnswer: 2
  },
  {
    id: 's3',
    question: 'What is the hardest natural substance on Earth?',
    options: ['Gold', 'Iron', 'Diamond', 'Platinum'],
    correctAnswer: 2
  },
  {
    id: 's4',
    question: 'How many bones are in the adult human body?',
    options: ['206', '208', '210', '212'],
    correctAnswer: 0
  }
]

interface ChallengeCard {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  questions: any[]
  icon: any
  color: string
  gameType: 'tug-of-war' | 'racing'
}

const challenges: ChallengeCard[] = [
  {
    id: 'general',
    title: 'General Knowledge Showdown',
    description: 'Test your general knowledge across multiple subjects!',
    difficulty: 'easy',
    category: 'Mixed',
    questions: sampleQuestions,
    icon: Brain,
    color: 'bg-blue-500',
    gameType: 'tug-of-war'
  },
  {
    id: 'math',
    title: 'Math Racing Challenge',
    description: 'Race to the finish line with mathematical prowess!',
    difficulty: 'medium',
    category: 'Mathematics',
    questions: mathQuestions,
    icon: Car,
    color: 'bg-purple-500',
    gameType: 'racing'
  },
  {
    id: 'science',
    title: 'Science Battle',
    description: 'Show your scientific knowledge in this epic battle!',
    difficulty: 'medium',
    category: 'Science',
    questions: scienceQuestions,
    icon: Trophy,
    color: 'bg-green-500',
    gameType: 'tug-of-war'
  }
]

export default function ChallengesPage() {
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeCard | null>(null)

  if (selectedChallenge) {
    return (
      <div className="min-h-screen">
        <div className="p-4">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedChallenge(null)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Challenges
          </Button>
        </div>
        
        {selectedChallenge.gameType === 'tug-of-war' ? (
          <TugOfWar 
            questions={selectedChallenge.questions}
            teamAName="Team Alpha"
            teamBName="Team Beta"
            pullDistance={6}
            winThreshold={85}
          />
        ) : (
          <RacingGame 
            questions={selectedChallenge.questions}
            playerName="You"
            opponentName="AI Racer"
            speedPerCorrect={12}
          />
        )}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Learning Challenges</h1>
            <p className="text-muted-foreground">Compete in exciting educational games!</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Challenges Completed</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Win Rate</CardDescription>
            <CardTitle className="text-3xl">0%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Points</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Game Selection */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Available Challenges</h2>
        <p className="text-muted-foreground mb-6">
          Choose a challenge to start playing. Answer questions correctly to win the tug of war!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => {
            const Icon = challenge.icon
            return (
              <Card key={challenge.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 ${challenge.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <Badge variant={
                      challenge.difficulty === 'easy' ? 'default' : 
                      challenge.difficulty === 'medium' ? 'secondary' : 
                      'destructive'
                    }>
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  
                  <CardTitle className="mb-2">{challenge.title}</CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <Badge variant="outline">{challenge.category}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Questions:</span>
                      <span className="font-medium">{challenge.questions.length}</span>
                    </div>
                    
                    <Button 
                      className="w-full mt-4" 
                      onClick={() => setSelectedChallenge(challenge)}
                    >
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      Start Challenge
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* How to Play */}
      <Card>
        <CardHeader>
          <CardTitle>How to Play</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Choose a Challenge</h4>
                <p className="text-sm text-muted-foreground">Select from various themed challenges based on your interest</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-purple-600">2</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Answer Questions</h4>
                <p className="text-sm text-muted-foreground">Each correct answer pulls the rope toward your team</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-green-600">3</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Pull the Rope</h4>
                <p className="text-sm text-muted-foreground">Watch as your team pulls the rope with each correct answer</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-orange-600">4</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Win the Game</h4>
                <p className="text-sm text-muted-foreground">Pull the rope to your side to claim victory!</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
