'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Check, Copy, Crown, Loader2, LogOut, Play, RefreshCw, Users, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Player {
  userId: { _id: string; name: string }
  name: string
  team: 'alpha' | 'beta'
  score: number
  isReady: boolean
}

interface GameRoom {
  _id: string
  roomCode: string
  challengeId: string
  creatorId: { _id: string; name: string }
  status: string
  maxPlayersPerTeam: number
  players: Player[]
  gameState: {
    ropePosition: number
    currentQuestionIndex: number
    teamAScore: number
    teamBScore: number
  }
}

interface MultiplayerLobbyProps {
  roomCode: string
  onGameStart: (roomData: GameRoom) => void
  onLeave: () => void
}

export default function MultiplayerLobby({ roomCode, onGameStart, onLeave }: MultiplayerLobbyProps) {
  const [room, setRoom] = useState<GameRoom | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Fetch current user ID
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch('/api/users/me')
        const data = await res.json()
        if (data.user && data.user._id) {
          setCurrentUserId(data.user._id)
          console.log('Current user ID fetched:', data.user._id)
        }
      } catch (error) {
        console.error('Error fetching current user:', error)
      }
    }
    fetchCurrentUser()
  }, [])

  // Poll for room updates every 2 seconds
  useEffect(() => {
    fetchRoom()
    const interval = setInterval(fetchRoom, 2000)
    return () => clearInterval(interval)
  }, [roomCode])

  // Check if game started
  useEffect(() => {
    if (room && room.status === 'in-progress') {
      onGameStart(room)
    }
  }, [room?.status])

  const fetchRoom = async () => {
    try {
      const res = await fetch(`/api/student/game-rooms/${roomCode}`)
      const data = await res.json()

      if (data.success) {
        setRoom(data.room)
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch room',
          variant: 'destructive',
        })
        onLeave()
      }
    } catch (error) {
      console.error('Error fetching room:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleReady = async () => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/student/game-rooms/${roomCode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ready' }),
      })

      const data = await res.json()

      if (data.success) {
        setRoom(data.room)
      } else {
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update ready status',
        variant: 'destructive',
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleSwitchTeam = async () => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/student/game-rooms/${roomCode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'switch-team' }),
      })

      const data = await res.json()

      if (data.success) {
        setRoom(data.room)
        toast({
          title: 'Team Switched!',
          description: 'You have been moved to the other team',
        })
      } else {
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to switch team',
        variant: 'destructive',
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleStartGame = async () => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/student/game-rooms/${roomCode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' }),
      })

      const data = await res.json()

      if (data.success) {
        // Game will start, component will detect status change
      } else {
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start game',
        variant: 'destructive',
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleLeave = async () => {
    try {
      await fetch(`/api/student/game-rooms/${roomCode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'leave' }),
      })
      onLeave()
    } catch (error) {
      console.error('Error leaving room:', error)
      onLeave()
    }
  }

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: 'Copied!',
      description: 'Room code copied to clipboard',
    })
  }

  if (loading || !room) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  const teamAPlayers = room.players.filter((p) => p.team === 'alpha')
  const teamBPlayers = room.players.filter((p) => p.team === 'beta')
  const allReady = room.players.every((p) => p.isReady)
  
  // Find current player first
  const currentPlayer = room.players.find((p) => 
    p.userId._id === currentUserId || 
    p.userId._id.toString() === currentUserId ||
    String(p.userId._id) === String(currentUserId)
  )
  
  // Check if current user is creator - handle multiple ID format comparisons
  const isCreator = currentUserId && (
    room.creatorId._id === currentUserId || 
    room.creatorId._id.toString() === currentUserId ||
    String(room.creatorId._id) === String(currentUserId) ||
    (currentPlayer && String(room.creatorId._id) === String(currentPlayer.userId._id))
  )

  console.log('Debug - Creator check:', {
    currentUserId,
    creatorId: room.creatorId._id,
    isCreator,
    currentPlayer: currentPlayer?.name
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="w-8 h-8" />
              Multiplayer Lobby
              {isCreator && (
                <Badge className="bg-yellow-500 text-white ml-2">
                  <Crown className="w-3 h-3 mr-1" />
                  Creator
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isCreator 
                ? 'You are the room creator - You can start the game when everyone is ready!' 
                : 'Waiting for players to join...'}
            </p>
          </div>
          <Button variant="outline" onClick={handleLeave}>
            <LogOut className="w-4 h-4 mr-2" />
            Leave
          </Button>
        </div>

        {/* Room Code Card */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Room Code</p>
                <p className="text-4xl font-bold tracking-wider">{roomCode}</p>
              </div>
              <Button
                variant="secondary"
                size="lg"
                onClick={copyRoomCode}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                {copied ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </Button>
            </div>
            <p className="text-sm opacity-90 mt-3">
              Share this code with your classmates to join the game
            </p>
          </CardContent>
        </Card>

        {/* Teams */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Team Alpha */}
          <Card className="border-2 border-blue-500">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center justify-between">
                <span className="text-blue-600">👥 Team Alpha</span>
                <Badge variant="secondary">
                  {teamAPlayers.length}/{room.maxPlayersPerTeam}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {teamAPlayers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Waiting for players...
                </div>
              ) : (
                <div className="space-y-3">
                  {teamAPlayers.map((player, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {player.name[0]}
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-2">
                            {player.name}
                            {player.userId._id === room.creatorId._id && (
                              <Crown className="w-4 h-4 text-yellow-500" />
                            )}
                            {player.userId._id === currentUserId && (
                              <Badge variant="secondary" className="text-xs">You</Badge>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {player.isReady ? (
                          <Badge className="bg-green-500">
                            <Check className="w-3 h-3 mr-1" />
                            Ready
                          </Badge>
                        ) : (
                          <>
                            <Badge variant="outline">Waiting</Badge>
                            {player.userId._id === currentUserId && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleSwitchTeam}
                                disabled={updating}
                                className="text-xs"
                              >
                                <RefreshCw className="w-3 h-3 mr-1" />
                                Switch
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Beta */}
          <Card className="border-2 border-red-500">
            <CardHeader className="bg-red-50">
              <CardTitle className="flex items-center justify-between">
                <span className="text-red-600">👥 Team Beta</span>
                <Badge variant="secondary">
                  {teamBPlayers.length}/{room.maxPlayersPerTeam}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {teamBPlayers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Waiting for players...
                </div>
              ) : (
                <div className="space-y-3">
                  {teamBPlayers.map((player, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                          {player.name[0]}
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-2">
                            {player.name}
                            {player.userId._id === room.creatorId._id && (
                              <Crown className="w-4 h-4 text-yellow-500" />
                            )}
                            {player.userId._id === currentUserId && (
                              <Badge variant="secondary" className="text-xs">You</Badge>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {player.isReady ? (
                          <Badge className="bg-green-500">
                            <Check className="w-3 h-3 mr-1" />
                            Ready
                          </Badge>
                        ) : (
                          <>
                            <Badge variant="outline">Waiting</Badge>
                            {player.userId._id === currentUserId && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleSwitchTeam}
                                disabled={updating}
                                className="text-xs"
                              >
                                <RefreshCw className="w-3 h-3 mr-1" />
                                Switch
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Players: {room.players.length}</p>
                <p className="text-sm text-muted-foreground">
                  {allReady ? 'All players ready!' : 'Waiting for players to ready up...'}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleToggleReady}
                  disabled={updating}
                  variant={room.players.find((p) => p.userId._id === currentUserId)?.isReady ? 'outline' : 'default'}
                  size="lg"
                >
                  {updating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : room.players.find((p) => p.userId._id === currentUserId)?.isReady ? (
                    <X className="w-4 h-4 mr-2" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  {room.players.find((p) => p.userId._id === currentUserId)?.isReady ? 'Not Ready' : 'Ready'}
                </Button>

                {isCreator && (
                  <Button
                    onClick={handleStartGame}
                    disabled={!allReady || updating || teamAPlayers.length === 0 || teamBPlayers.length === 0}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {updating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    Start Game
                  </Button>
                )}
              </div>
            </div>

            {isCreator && (!allReady || teamAPlayers.length === 0 || teamBPlayers.length === 0) && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  {teamAPlayers.length === 0 || teamBPlayers.length === 0
                    ? '⚠️ Both teams need at least one player to start'
                    : '⚠️ All players must be ready before starting'}
                </p>
              </div>
            )}

            {!isCreator && currentPlayer && !currentPlayer.isReady && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> You can switch teams using the "Switch" button next to your name before clicking Ready!
                </p>
              </div>
            )}

            {!isCreator && allReady && (
              <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-800">
                  ⏳ Waiting for the room creator to start the game...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
