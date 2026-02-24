'use client'

import MultiplayerLobby from '@/components/lab/games/MultiplayerLobby'
import RacingGame from '@/components/lab/games/RacingGame'
import TugOfWar from '@/components/lab/games/TugOfWar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Brain, Car, Crown, Gamepad2, Loader2, Lock, Trophy, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

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
    description: 'Test your knowledge against the computer in a tug of war battle!',
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
  const [gameMode, setGameMode] = useState<'single' | 'multiplayer' | 'lobby' | 'multi-game' | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showJoinDialog, setShowJoinDialog] = useState(false)
  const [availableRooms, setAvailableRooms] = useState<any[]>([])
  const [loadingRooms, setLoadingRooms] = useState(false)
  const [creatingRoom, setCreatingRoom] = useState(false)
  const [joiningRoom, setJoiningRoom] = useState(false)
  const [roomCode, setRoomCode] = useState('')
  const [multiplayerRoom, setMultiplayerRoom] = useState<any>(null)
  const { toast } = useToast()

  // Form states for creating room
  const [teamSize, setTeamSize] = useState('2')
  const [password, setPassword] = useState('')
  const [classOnly, setClassOnly] = useState(true)

  // Join form state
  const [joinRoomCode, setJoinRoomCode] = useState('')
  const [joinPassword, setJoinPassword] = useState('')

  useEffect(() => {
    if (showJoinDialog) {
      fetchAvailableRooms()
    }
  }, [showJoinDialog])

  const fetchAvailableRooms = async () => {
    setLoadingRooms(true)
    try {
      const res = await fetch('/api/student/game-rooms')
      const data = await res.json()

      if (data.success) {
        setAvailableRooms(data.rooms)
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
    } finally {
      setLoadingRooms(false)
    }
  }

  const handleCreateRoom = async () => {
    if (!selectedChallenge) return
    if (!password.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a password',
        variant: 'destructive',
      })
      return
    }

    setCreatingRoom(true)
    try {
      const res = await fetch('/api/student/game-rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: selectedChallenge.id,
          maxPlayersPerTeam: parseInt(teamSize),
          password: password,
          classOnly: classOnly,
          questions: selectedChallenge.questions,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setRoomCode(data.room.roomCode)
        setShowCreateDialog(false)
        setGameMode('lobby')
        toast({
          title: 'Room Created!',
          description: `Room code: ${data.room.roomCode}`,
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to create room',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create room',
        variant: 'destructive',
      })
    } finally {
      setCreatingRoom(false)
    }
  }

  const handleJoinRoom = async (code: string, pwd: string) => {
    setJoiningRoom(true)
    try {
      const res = await fetch(`/api/student/game-rooms/${code}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          password: pwd,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setRoomCode(code)
        setShowJoinDialog(false)
        setGameMode('lobby')
        toast({
          title: 'Joined Room!',
          description: 'Waiting for game to start...',
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to join room',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to join room',
        variant: 'destructive',
      })
    } finally {
      setJoiningRoom(false)
    }
  }

  const handleGameStart = (room: any) => {
    setMultiplayerRoom(room)
    setGameMode('multi-game')
  }

  const handleLeaveLobby = () => {
    setGameMode(null)
    setRoomCode('')
    setSelectedChallenge(null)
  }

  // Show lobby if in lobby mode
  if (gameMode === 'lobby' && roomCode) {
    return <MultiplayerLobby roomCode={roomCode} onGameStart={handleGameStart} onLeave={handleLeaveLobby} />
  }

  // Show multiplayer game if started
  if (gameMode === 'multi-game' && multiplayerRoom && selectedChallenge) {
    return (
      <div className="min-h-screen">
        <div className="p-4">
          <Button 
            variant="ghost" 
            onClick={handleLeaveLobby}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Leave Game
          </Button>
        </div>
        
        {selectedChallenge.gameType === 'racing' ? (
          <RacingGame 
            questions={selectedChallenge.questions}
            playerName="Team Alpha"
            opponentName="Team Beta"
            speedPerCorrect={12}
          />
        ) : (
          <TugOfWar 
            questions={selectedChallenge.questions}
            teamAName="Team Alpha"
            teamBName="Team Beta"
            pullDistance={5}
            winThreshold={90}
          />
        )}
      </div>
    )
  }

  // Show single player game if selected
  if (selectedChallenge && gameMode === 'single') {
    return (
      <div className="min-h-screen">
        <div className="p-4">
          <Button 
            variant="ghost" 
            onClick={() => {
              setSelectedChallenge(null)
              setGameMode(null)
            }}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Challenges
          </Button>
        </div>
        
        {selectedChallenge.gameType === 'tug-of-war' ? (
          <TugOfWar 
            questions={selectedChallenge.questions}
            teamAName="You"
            teamBName="Computer"
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
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Available Challenges</h2>
              <p className="text-muted-foreground">
                Choose a challenge to start playing solo or create/join multiplayer rooms!
              </p>
            </div>
          </div>
          
          {/* Multiplayer Call to Action */}
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-1">🎮 Multiplayer Mode Available!</h3>
                  <p className="text-sm opacity-90">
                    Join a friend's game or browse active rooms to play together
                  </p>
                </div>
                <Button onClick={() => setShowJoinDialog(true)} size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                  <Users className="w-5 h-5 mr-2" />
                  Join Game Room
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => {
            const Icon = challenge.icon
            return (
              <Card key={challenge.id} className="group hover:shadow-lg transition-shadow">
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
                    
                    <div className="flex gap-2 mt-4">
                      <Button 
                        className="flex-1" 
                        variant="default"
                        onClick={() => {
                          setSelectedChallenge(challenge)
                          setGameMode('single')
                        }}
                      >
                        <Gamepad2 className="w-4 h-4 mr-2" />
                        Solo Play
                      </Button>
                      <Button 
                        className="flex-1" 
                        variant="secondary"
                        onClick={() => {
                          setSelectedChallenge(challenge)
                          setShowCreateDialog(true)
                        }}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Multiplayer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Create Multiplayer Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Multiplayer Game</DialogTitle>
            <DialogDescription className="space-y-2">
              Set up a multiplayer game room for your classmates to join
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="teamSize">Max Players Per Team</Label>
              <Select value={teamSize} onValueChange={setTeamSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Player</SelectItem>
                  <SelectItem value="2">2 Players</SelectItem>
                  <SelectItem value="3">3 Players</SelectItem>
                  <SelectItem value="4">4 Players</SelectItem>
                  <SelectItem value="5">5 Players</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Room Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Class Only</Label>
                <p className="text-sm text-muted-foreground">Only students from your class can join</p>
              </div>
              <Switch checked={classOnly} onCheckedChange={setClassOnly} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRoom} disabled={creatingRoom}>
              {creatingRoom && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Join Multiplayer Dialog */}
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Join Multiplayer Game</DialogTitle>
            <DialogDescription className="space-y-2">
              Enter a room code or select from available rooms
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="browse" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="browse">Browse Rooms</TabsTrigger>
              <TabsTrigger value="code">Enter Code</TabsTrigger>
            </TabsList>
            
            <TabsContent value="browse" className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Available game rooms</p>
                <Button variant="ghost" size="sm" onClick={fetchAvailableRooms}>
                  <Loader2 className={`w-4 h-4 mr-2 ${loadingRooms ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {loadingRooms ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : availableRooms.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No available rooms found
                  </div>
                ) : (
                  availableRooms.map((room) => (
                    <Card key={room._id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-lg">{room.roomCode}</p>
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Crown className="w-3 h-3" />
                            <span>{room.creatorId.name}</span>
                            <span>•</span>
                            <Users className="w-3 h-3" />
                            <span>{room.players.length}/{room.maxPlayersPerTeam * 2} players</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            const pwd = prompt('Enter room password:')
                            if (pwd) handleJoinRoom(room.roomCode, pwd)
                          }}
                          disabled={joiningRoom}
                        >
                          Join
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="code" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="joinRoomCode">Room Code</Label>
                  <Input
                    id="joinRoomCode"
                    placeholder="Enter room code"
                    value={joinRoomCode}
                    onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase())}
                    maxLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="joinPassword">Password</Label>
                  <Input
                    id="joinPassword"
                    type="password"
                    placeholder="Enter room password"
                    value={joinPassword}
                    onChange={(e) => setJoinPassword(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={() => handleJoinRoom(joinRoomCode, joinPassword)}
                  disabled={joiningRoom || !joinRoomCode || !joinPassword}
                >
                  {joiningRoom && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Join Room
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

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
                <p className="text-sm text-muted-foreground">Each correct answer helps you pull the rope toward your side</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-green-600">3</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Compete Against AI</h4>
                <p className="text-sm text-muted-foreground">Battle against the computer in a tug of war challenge</p>
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
