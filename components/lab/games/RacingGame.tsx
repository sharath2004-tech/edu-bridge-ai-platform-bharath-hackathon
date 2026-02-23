'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useState, useEffect, useCallback } from 'react'
import { Trophy, Flag, Zap } from 'lucide-react'

interface RacingGameProps {
  questions: QuizQuestion[]
  playerName?: string
  opponentName?: string
  speedPerCorrect?: number
}

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

interface GameState {
  playerPosition: number // 0-100
  opponentPosition: number // 0-100
  playerScore: number
  opponentScore: number
  currentQuestionIndex: number
  gameStatus: 'countdown' | 'playing' | 'finished'
  winner: 'player' | 'opponent' | null
  countdown: number
}

export default function RacingGame({
  questions,
  playerName = 'You',
  opponentName = 'AI Racer',
  speedPerCorrect = 12
}: RacingGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    playerPosition: 0,
    opponentPosition: 0,
    playerScore: 0,
    opponentScore: 0,
    currentQuestionIndex: 0,
    gameStatus: 'countdown',
    winner: null,
    countdown: 3
  })

  const [playerAccelerating, setPlayerAccelerating] = useState(false)
  const [opponentAccelerating, setOpponentAccelerating] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const currentQuestion = questions[gameState.currentQuestionIndex]

  // Countdown timer
  useEffect(() => {
    if (gameState.gameStatus === 'countdown' && gameState.countdown > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          countdown: prev.countdown - 1
        }))
      }, 1000)
      return () => clearTimeout(timer)
    } else if (gameState.gameStatus === 'countdown' && gameState.countdown === 0) {
      setGameState(prev => ({ ...prev, gameStatus: 'playing' }))
    }
  }, [gameState.countdown, gameState.gameStatus])

  // AI opponent simulation
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && !showFeedback) {
      const aiTimer = setTimeout(() => {
        // 60% chance AI answers correctly
        const aiCorrect = Math.random() < 0.6
        if (aiCorrect) {
          moveRacer('opponent')
        }
      }, Math.random() * 3000 + 2000) // Random delay 2-5 seconds

      return () => clearTimeout(aiTimer)
    }
  }, [gameState.currentQuestionIndex, gameState.gameStatus, showFeedback])

  // Move racer forward
  const moveRacer = useCallback((racer: 'player' | 'opponent') => {
    setGameState(prev => {
      if (prev.gameStatus !== 'playing') return prev

      const newPlayerPosition = racer === 'player' 
        ? Math.min(100, prev.playerPosition + speedPerCorrect)
        : prev.playerPosition
      
      const newOpponentPosition = racer === 'opponent'
        ? Math.min(100, prev.opponentPosition + speedPerCorrect)
        : prev.opponentPosition

      const newPlayerScore = racer === 'player' ? prev.playerScore + 1 : prev.playerScore
      const newOpponentScore = racer === 'opponent' ? prev.opponentScore + 1 : prev.opponentScore

      // Animation
      if (racer === 'player') {
        setPlayerAccelerating(true)
        setTimeout(() => setPlayerAccelerating(false), 500)
      } else {
        setOpponentAccelerating(true)
        setTimeout(() => setOpponentAccelerating(false), 500)
      }

      // Check win condition
      let newGameStatus: 'countdown' | 'playing' | 'finished' = prev.gameStatus
      let winner: 'player' | 'opponent' | null = prev.winner

      if (newPlayerPosition >= 100) {
        newGameStatus = 'finished'
        winner = 'player'
      } else if (newOpponentPosition >= 100) {
        newGameStatus = 'finished'
        winner = 'opponent'
      }

      return {
        ...prev,
        playerPosition: newPlayerPosition,
        opponentPosition: newOpponentPosition,
        playerScore: newPlayerScore,
        opponentScore: newOpponentScore,
        gameStatus: newGameStatus,
        winner
      }
    })
  }, [speedPerCorrect])

  // Handle answer submission
  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || !currentQuestion) return

    const correct = selectedAnswer === currentQuestion.correctAnswer
    setIsCorrect(correct)
    setShowFeedback(true)

    if (correct) {
      moveRacer('player')
    }

    // Move to next question
    setTimeout(() => {
      setShowFeedback(false)
      setSelectedAnswer(null)

      if (gameState.currentQuestionIndex < questions.length - 1 && gameState.gameStatus === 'playing') {
        setGameState(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1
        }))
      }
    }, 1500)
  }

  // Reset game
  const resetGame = () => {
    setGameState({
      playerPosition: 0,
      opponentPosition: 0,
      playerScore: 0,
      opponentScore: 0,
      currentQuestionIndex: 0,
      gameStatus: 'countdown',
      winner: null,
      countdown: 3
    })
    setSelectedAnswer(null)
    setShowFeedback(false)
  }

  return (
    <div className="w-full min-h-screen p-4 bg-gradient-to-b from-sky-100 to-green-100">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Countdown Overlay */}
        {gameState.gameStatus === 'countdown' && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="text-9xl font-bold text-white mb-4 animate-bounce">
                {gameState.countdown || 'GO!'}
              </div>
              <p className="text-2xl text-white">Get Ready to Race!</p>
            </div>
          </div>
        )}

        {/* Score Header */}
        <div className="flex items-center justify-between gap-4">
          <Card className="flex-1 p-4 bg-blue-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏎️</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{playerName}</p>
                <p className="text-2xl font-bold">{gameState.playerScore}</p>
              </div>
            </div>
          </Card>

          <Card className="flex-1 p-4 bg-red-50">
            <div className="flex items-center justify-end gap-3">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{opponentName}</p>
                <p className="text-2xl font-bold">{gameState.opponentScore}</p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏎️</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Racing Track */}
        <Card className="p-8 relative overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200">
          {/* Track Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full" style={{ 
              backgroundImage: 'repeating-linear-gradient(90deg, white 0px, white 40px, transparent 40px, transparent 80px)',
              backgroundSize: '80px 100%'
            }} />
          </div>

          {/* Player Lane */}
          <div className="relative mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-blue-600">{playerName}</span>
              <span className="text-sm text-muted-foreground">{Math.round(gameState.playerPosition)}%</span>
            </div>
            
            <div className="relative h-20 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg border-4 border-blue-400 overflow-hidden">
              {/* Finish Line */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-yellow-400" />
              <Flag className="absolute right-2 top-1/2 -mt-3 w-6 h-6 text-yellow-600" />
              
              {/* Player Car */}
              <div 
                className={`absolute top-1/2 -mt-8 transition-all duration-500 ${playerAccelerating ? 'scale-110' : ''}`}
                style={{ 
                  left: `${gameState.playerPosition}%`,
                  transform: `translateX(-50%) ${playerAccelerating ? 'translateX(-55%)' : ''}`,
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <div className="text-5xl filter drop-shadow-lg">🏎️</div>
                {playerAccelerating && (
                  <div className="absolute -right-8 top-1/2 -mt-2">
                    <Zap className="w-8 h-8 text-yellow-400 animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Opponent Lane */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-red-600">{opponentName}</span>
              <span className="text-sm text-muted-foreground">{Math.round(gameState.opponentPosition)}%</span>
            </div>
            
            <div className="relative h-20 bg-gradient-to-r from-red-200 to-red-300 rounded-lg border-4 border-red-400 overflow-hidden">
              {/* Finish Line */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-yellow-400" />
              <Flag className="absolute right-2 top-1/2 -mt-3 w-6 h-6 text-yellow-600" />
              
              {/* Opponent Car */}
              <div 
                className={`absolute top-1/2 -mt-8 transition-all duration-500 ${opponentAccelerating ? 'scale-110' : ''}`}
                style={{ 
                  left: `${gameState.opponentPosition}%`,
                  transform: `translateX(-50%) ${opponentAccelerating ? 'translateX(-55%)' : ''}`,
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <div className="text-5xl filter drop-shadow-lg">🏎️</div>
                {opponentAccelerating && (
                  <div className="absolute -right-8 top-1/2 -mt-2">
                    <Zap className="w-8 h-8 text-orange-400 animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Comparison */}
          <div className="mt-6 flex justify-center">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Lead</p>
              <p className="text-lg font-bold">
                {gameState.playerPosition > gameState.opponentPosition
                  ? `${playerName} +${Math.round(gameState.playerPosition - gameState.opponentPosition)}%`
                  : gameState.opponentPosition > gameState.playerPosition
                  ? `${opponentName} +${Math.round(gameState.opponentPosition - gameState.playerPosition)}%`
                  : 'Tied!'}
              </p>
            </div>
          </div>
        </Card>

        {/* Quiz Section */}
        {gameState.gameStatus === 'playing' && currentQuestion && (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Question {gameState.currentQuestionIndex + 1}/{questions.length}</h3>
                <span className="text-sm text-muted-foreground">Answer quickly to speed ahead!</span>
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
                        ? 'border-primary bg-primary/10 scale-105'
                        : 'border-gray-200 hover:border-primary/50 hover:scale-102'
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
                <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                  <p className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? '🏁 Correct! You speed ahead!' : '❌ Incorrect! Try the next one!'}
                  </p>
                </div>
              )}

              <Button 
                onClick={handleAnswerSubmit}
                disabled={selectedAnswer === null || showFeedback}
                className="w-full"
                size="lg"
              >
                <Zap className="w-4 h-4 mr-2" />
                Submit Answer
              </Button>
            </div>
          </Card>
        )}

        {/* Game Over Modal */}
        {gameState.gameStatus === 'finished' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <Card className="p-8 max-w-md w-full mx-4 text-center animate-in zoom-in">
              <div className="mb-6">
                <Trophy className={`w-24 h-24 mx-auto ${gameState.winner === 'player' ? 'text-yellow-500' : 'text-gray-400'}`} />
              </div>
              
              <h2 className="text-3xl font-bold mb-2">
                {gameState.winner === 'player' ? '🎉 You Win! 🎉' : '💪 Try Again!'}
              </h2>
              
              <p className="text-muted-foreground mb-6">
                Final Score: {playerName} {gameState.playerScore} - {gameState.opponentScore} {opponentName}
              </p>

              <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                <p className="text-sm font-medium">
                  {gameState.winner === 'player' 
                    ? '🏆 Champion! You finished first!' 
                    : '🎯 Keep racing to improve!'}
                </p>
              </div>

              <div className="flex gap-3">
                <Button onClick={resetGame} className="flex-1" size="lg">
                  Race Again
                </Button>
                <Button variant="outline" className="flex-1" size="lg" onClick={() => window.history.back()}>
                  Exit
                </Button>
              </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  )
}
