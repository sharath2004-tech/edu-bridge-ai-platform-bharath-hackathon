'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { AlertCircle, CheckCircle, Clock, MessageSquare, Plus, Send, Ticket as TicketIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Ticket {
  _id: string
  title: string
  description: string
  category: string
  priority: string
  status: string
  createdAt: string
  assignedTo?: { name: string; role: string }
  responses: Array<{
    message: string
    respondedBy: { name: string; role: string }
    respondedAt: string
    isAdmin: boolean
  }>
}

export default function StudentTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [creating, setCreating] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [replyMessage, setReplyMessage] = useState('')
  const [replying, setReplying] = useState(false)
  const { toast } = useToast()

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'Academic',
    priority: 'medium',
  })

  useEffect(() => {
    fetchTickets()
  }, [statusFilter])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      const res = await fetch(`/api/student/tickets?${params}`)
      const data = await res.json()

      if (data.success) {
        setTickets(data.tickets)
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch tickets',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch tickets',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      const res = await fetch('/api/student/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTicket),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Ticket created successfully',
        })
        setIsCreateDialogOpen(false)
        setNewTicket({
          title: '',
          description: '',
          category: 'Academic',
          priority: 'medium',
        })
        fetchTickets()
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to create ticket',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error occurred',
        variant: 'destructive',
      })
    } finally {
      setCreating(false)
    }
  }

  const handleAddReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return

    setReplying(true)

    try {
      const res = await fetch(`/api/student/tickets/${selectedTicket._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyMessage }),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Reply added successfully',
        })
        setReplyMessage('')
        setSelectedTicket(data.ticket)
        fetchTickets()
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to add reply',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error occurred',
        variant: 'destructive',
      })
    } finally {
      setReplying(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any; label: string }> = {
      open: { variant: 'default', icon: AlertCircle, label: 'Open' },
      'in-progress': { variant: 'secondary', icon: Clock, label: 'In Progress' },
      resolved: { variant: 'outline', icon: CheckCircle, label: 'Resolved' },
      closed: { variant: 'outline', icon: CheckCircle, label: 'Closed' },
    }

    const config = variants[status] || variants.open
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    }

    return (
      <Badge className={colors[priority] || colors.medium}>
        {priority.toUpperCase()}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TicketIcon className="h-8 w-8" />
            Support Tickets
          </h1>
          <p className="text-muted-foreground mt-2">
            Report issues and track their resolution
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Tickets</CardDescription>
            <CardTitle className="text-3xl">{tickets.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Open</CardDescription>
            <CardTitle className="text-3xl text-blue-600">
              {tickets.filter((t) => t.status === 'open').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">
              {tickets.filter((t) => t.status === 'in-progress').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Resolved</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {tickets.filter((t) => t.status === 'resolved').length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-[200px]">
              <Label>Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tickets</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Loading tickets...
            </CardContent>
          </Card>
        ) : tickets.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No tickets found. Create a new ticket to report an issue.
            </CardContent>
          </Card>
        ) : (
          tickets.map((ticket) => (
            <Card
              key={ticket._id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedTicket(ticket)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-lg">{ticket.title}</CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                      <Badge variant="outline">{ticket.category}</Badge>
                      {ticket.responses.length > 0 && (
                        <Badge variant="secondary" className="gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {ticket.responses.length} {ticket.responses.length === 1 ? 'reply' : 'replies'}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-2">{ticket.description}</p>
                {ticket.assignedTo && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Assigned to: <span className="font-medium">{ticket.assignedTo.name}</span> ({ticket.assignedTo.role})
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Ticket Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
            <DialogDescription>
              Report an issue or problem you're facing in school
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateTicket}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  placeholder="Brief summary of the issue"
                  required
                  maxLength={200}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={newTicket.category}
                    onValueChange={(value) => setNewTicket({ ...newTicket, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Academic">Academic</SelectItem>
                      <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Canteen">Canteen</SelectItem>
                      <SelectItem value="Bullying">Bullying</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTicket.priority}
                    onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Provide detailed information about the issue..."
                  required
                  rows={6}
                  maxLength={2000}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {newTicket.description.length}/2000 characters
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? 'Creating...' : 'Create Ticket'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Ticket Details Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedTicket.title}</span>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedTicket.status)}
                    {getPriorityBadge(selectedTicket.priority)}
                  </div>
                </DialogTitle>
                <DialogDescription>
                  <Badge variant="outline">{selectedTicket.category}</Badge>
                  <span className="ml-2">
                    Created: {new Date(selectedTicket.createdAt).toLocaleString()}
                  </span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>

                {/* Assigned To */}
                {selectedTicket.assignedTo && (
                  <div>
                    <h3 className="font-semibold mb-1">Assigned To</h3>
                    <p className="text-muted-foreground">
                      {selectedTicket.assignedTo.name} ({selectedTicket.assignedTo.role})
                    </p>
                  </div>
                )}

                {/* Responses */}
                {selectedTicket.responses.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Conversation</h3>
                    <div className="space-y-3">
                      {selectedTicket.responses.map((response, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg ${
                            response.isAdmin
                              ? 'bg-blue-50 border border-blue-200'
                              : 'bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium flex items-center gap-2">
                                {response.respondedBy.name}
                                <Badge variant="outline" className="text-xs">
                                  {response.respondedBy.role}
                                </Badge>
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(response.respondedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{response.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reply Box - Only for open/in-progress tickets */}
                {['open', 'in-progress'].includes(selectedTicket.status) && (
                  <div className="border-t pt-4">
                    <Label htmlFor="reply">Add Reply</Label>
                    <Textarea
                      id="reply"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your message..."
                      rows={3}
                      className="mt-2"
                    />
                    <Button
                      onClick={handleAddReply}
                      disabled={replying || !replyMessage.trim()}
                      className="mt-2"
                      size="sm"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {replying ? 'Sending...' : 'Send Reply'}
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
