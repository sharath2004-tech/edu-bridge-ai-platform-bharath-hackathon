'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Trophy, Users, Zap } from 'lucide-react'
import { useCallback, useState } from 'react'

interface TugOfWarProps {
  questions: QuizQuestion[]
  teamAName?: string
  teamBName?: string
  pullDistance?: number
  winThreshold?: number
}

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

interface GameState {
  ropePosition: number // 0-100, 50 is center
  teamAScore: number
  teamBScore: number
  currentQuestionIndex: number
  gameStatus: 'playing' | 'won' | 'lost'
  winningTeam: 'alpha' | 'beta' | null
  isAnimating: boolean
}

export default function TugOfWar({
  questions,
  teamAName = 'Team Alpha',
  teamBName = 'Team Beta',
  pullDistance = 5,
  winThreshold = 90
}: TugOfWarProps) {
  const [gameState, setGameState] = useState<GameState>({
    ropePosition: 50,
    teamAScore: 0,
    teamBScore: 0,
    currentQuestionIndex: 0,
    gameStatus: 'playing',
    winningTeam: null,
    isAnimating: false
  })

  const [teamAPulling, setTeamAPulling] = useState(false)
  const [teamBPulling, setTeamBPulling] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const currentQuestion = questions[gameState.currentQuestionIndex]

  // Calculate background color based on rope position
  const getBackgroundGradient = () => {
    const alphaIntensity = Math.max(0, 50 - gameState.ropePosition)
    const betaIntensity = Math.max(0, gameState.ropePosition - 50)
    
    return `linear-gradient(to right, 
      rgba(59, 130, 246, ${alphaIntensity / 50 * 0.3}) 0%, 
      rgba(255, 255, 255, 0) 50%, 
      rgba(239, 68, 68, ${betaIntensity / 50 * 0.3}) 100%)`
  }

  // Update rope position and check win condition
  const updateRope = useCallback((teamId: 'alpha' | 'beta') => {
    setGameState(prev => {
      if (prev.isAnimating || prev.gameStatus !== 'playing') return prev

      // Calculate new position
      let newPosition = prev.ropePosition
      let newTeamAScore = prev.teamAScore
      let newTeamBScore = prev.teamBScore

      if (teamId === 'alpha') {
        newPosition = Math.max(0, prev.ropePosition - pullDistance)
        newTeamAScore++
        setTeamAPulling(true)
        setTimeout(() => setTeamAPulling(false), 600)
      } else {
        newPosition = Math.min(100, prev.ropePosition + pullDistance)
        newTeamBScore++
        setTeamBPulling(true)
        setTimeout(() => setTeamBPulling(false), 600)
      }

      // Check win condition
      let newGameStatus: 'playing' | 'won' | 'lost' = prev.gameStatus
      let winningTeam: 'alpha' | 'beta' | null = prev.winningTeam

      if (newPosition <= (100 - winThreshold)) {
        newGameStatus = 'won'
        winningTeam = 'alpha'
      } else if (newPosition >= winThreshold) {
        newGameStatus = 'won'
        winningTeam = 'beta'
      }

      return {
        ...prev,
        ropePosition: newPosition,
        teamAScore: newTeamAScore,
        teamBScore: newTeamBScore,
        gameStatus: newGameStatus,
        winningTeam,
        isAnimating: true
      }
    })

    // Reset animation flag
    setTimeout(() => {
      setGameState(prev => ({ ...prev, isAnimating: false }))
    }, 500)
  }, [pullDistance, winThreshold])

  // Handle answer submission
  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || !currentQuestion) return

    const correct = selectedAnswer === currentQuestion.correctAnswer
    setIsCorrect(correct)
    setShowFeedback(true)

    // Randomly assign to a team for single player (or use team logic)
    const randomTeam = Math.random() > 0.5 ? 'alpha' : 'beta'
    
    if (correct) {
      updateRope(randomTeam)
    }

    // Move to next question or end game
    setTimeout(() => {
      setShowFeedback(false)
      setSelectedAnswer(null)

      if (gameState.currentQuestionIndex < questions.length - 1) {
        setGameState(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1
        }))
      }
    }, 2000)
  }

  // Reset game
  const resetGame = () => {
    setGameState({
      ropePosition: 50,
      teamAScore: 0,
      teamBScore: 0,
      currentQuestionIndex: 0,
      gameStatus: 'playing',
      winningTeam: null,
      isAnimating: false
    })
    setSelectedAnswer(null)
    setShowFeedback(false)
  }

  return (
    <div className="w-full min-h-screen p-4" style={{ background: getBackgroundGradient() }}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Score Header */}
        <div className="flex items-center justify-between gap-4">
          <Card className="flex-1 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{teamAName}</p>
                <p className="text-2xl font-bold">{gameState.teamAScore}</p>
              </div>
            </div>
          </Card>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="w-5 h-5" />
            <span className="font-medium">VS</span>
          </div>

          <Card className="flex-1 p-4">
            <div className="flex items-center justify-end gap-3">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{teamBName}</p>
                <p className="text-2xl font-bold">{gameState.teamBScore}</p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tug of War Arena */}
        <Card className="p-8 relative overflow-hidden">
          {/* Team Avatars */}
          <div className="flex items-center justify-between mb-8">
            {/* Team Alpha Avatar */}
            <div className={`transition-all duration-300 ${teamAPulling ? 'animate-pull-left' : ''} ${gameState.winningTeam === 'alpha' ? 'animate-celebration' : ''} ${gameState.winningTeam === 'beta' ? 'animate-defeat' : ''}`}>
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Users className="w-12 h-12 text-white" />
              </div>
              <p className="text-center mt-2 font-medium text-blue-600">{teamAName}</p>
            </div>

            {/* Team Beta Avatar */}
            <div className={`transition-all duration-300 ${teamBPulling ? 'animate-pull-right' : ''} ${gameState.winningTeam === 'beta' ? 'animate-celebration' : ''} ${gameState.winningTeam === 'alpha' ? 'animate-defeat' : ''}`}>
              <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                <Users className="w-12 h-12 text-white" />
              </div>
              <p className="text-center mt-2 font-medium text-red-600">{teamBName}</p>
            </div>
          </div>

          {/* Rope Track */}
          <div className="relative h-24 bg-gradient-to-b from-gray-200 to-gray-300 rounded-lg shadow-inner">
            {/* Threshold Markers */}
            <div className="absolute left-[10%] top-0 bottom-0 w-0.5 bg-blue-500/30" />
            <div className="absolute right-[10%] top-0 bottom-0 w-0.5 bg-red-500/30" />
            
            {/* Center Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-400 -ml-0.5" />

            {/* Rope */}
            <div className="absolute top-1/2 left-0 right-0 h-4 -mt-2">
              <div className="h-full bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 rounded-full shadow-md" />
            </div>

            {/* Knot Marker */}
            <div 
              className="absolute top-1/2 -mt-6 w-12 h-12 transition-all duration-500 ease-out"
              style={{ 
                left: `${gameState.ropePosition}%`,
                transform: 'translateX(-50%)',
                transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800 rounded-full shadow-lg flex items-center justify-center border-4 border-white">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-red-500 transition-all duration-500"
              style={{ width: `${gameState.ropePosition}%` }}
            />
          </div>
        </Card>

        {/* Quiz Section */}
        {gameState.gameStatus === 'playing' && currentQuestion && (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Question {gameState.currentQuestionIndex + 1}/{questions.length}</h3>
                <span className="text-sm text-muted-foreground">Answer correctly to pull the rope!</span>
              </div>

              <p className="text-xl">{currentQuestion.question}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAnswer(index)}
                    disabled={showFeedback}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedAnswer === index
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-primary/50'
                    } ${showFeedback && index === currentQuestion.correctAnswer ? 'border-green-500 bg-green-50' : ''} ${showFeedback && selectedAnswer === index && index !== currentQuestion.correctAnswer ? 'border-red-500 bg-red-50' : ''} disabled:opacity-50`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-left flex-1">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {showFeedback && (
                <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? '🎉 Correct! Your team pulls the rope!' : '❌ Incorrect! The other team gets stronger!'}
                  </p>
                </div>
              )}

              <Button 
                onClick={handleAnswerSubmit}
                disabled={selectedAnswer === null || showFeedback}
                className="w-full"
                size="lg"
              >
                Submit Answer
              </Button>
            </div>
          </Card>
        )}

        {/* Game Over Modal */}
        {gameState.gameStatus === 'won' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <Card className="p-8 max-w-md w-full mx-4 text-center">
              <div className="mb-6">
                <Trophy className={`w-24 h-24 mx-auto ${gameState.winningTeam === 'alpha' ? 'text-blue-500' : 'text-red-500'}`} />
              </div>
              
              <h2 className="text-3xl font-bold mb-2">
                {gameState.winningTeam === 'alpha' ? teamAName : teamBName} Wins!
              </h2>
              
              <p className="text-muted-foreground mb-6">
                Final Score: {teamAName} {gameState.teamAScore} - {gameState.teamBScore} {teamBName}
              </p>

              <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                <p className="text-sm font-medium">🎊 Congratulations! 🎊</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Amazing teamwork and knowledge!
                </p>
              </div>

              <div className="flex gap-3">
                <Button onClick={resetGame} className="flex-1" size="lg">
                  Play Again
                </Button>
                <Button variant="outline" className="flex-1" size="lg" onClick={() => window.history.back()}>
                  Exit
                </Button>
              </div>
            </Card>
          </div>
        )}

      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pull-left {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-10px) rotate(-5deg); }
          75% { transform: translateX(-5px) rotate(-3deg); }
        }

        @keyframes pull-right {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(10px) rotate(5deg); }
          75% { transform: translateX(5px) rotate(3deg); }
        }

        @keyframes celebration {
          0%, 100% { transform: translateY(0) scale(1); }
          25% { transform: translateY(-20px) scale(1.1); }
          50% { transform: translateY(-10px) scale(1.05) rotate(5deg); }
          75% { transform: translateY(-15px) scale(1.08) rotate(-5deg); }
        }

        @keyframes defeat {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(10px) rotate(15deg) scale(0.9); opacity: 0.7; }
        }

        .animate-pull-left {
          animation: pull-left 0.6s ease-out;
        }

        .animate-pull-right {
          animation: pull-right 0.6s ease-out;
        }

        .animate-celebration {
          animation: celebration 1s ease-in-out infinite;
        }

        .animate-defeat {
          animation: defeat 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
