'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { AlertCircle, CheckCircle, Clock, MessageSquare, Search, Send, Ticket as TicketIcon, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Ticket {
  _id: string
  title: string
  description: string
  category: string
  priority: string
  status: string
  createdAt: string
  studentId: {
    _id: string
    name: string
    email: string
    rollNo?: number
    className?: string
    section?: string
  }
  assignedTo?: { _id: string; name: string; role: string }
  responses: Array<{
    message: string
    respondedBy: { name: string; role: string }
    respondedAt: string
    isAdmin: boolean
  }>
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [stats, setStats] = useState({ open: 0, 'in-progress': 0, resolved: 0, closed: 0 })
  const [replyMessage, setReplyMessage] = useState('')
  const [updating, setUpdating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchTickets()
  }, [statusFilter, categoryFilter, priorityFilter])

  useEffect(() => {
    // Filter tickets by search query
    if (searchQuery.trim()) {
      const filtered = tickets.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.studentId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredTickets(filtered)
    } else {
      setFilteredTickets(tickets)
    }
  }, [searchQuery, tickets])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (categoryFilter !== 'all') params.append('category', categoryFilter)
      if (priorityFilter !== 'all') params.append('priority', priorityFilter)

      const res = await fetch(`/api/admin/tickets?${params}`)
      const data = await res.json()

      if (data.success) {
        setTickets(data.tickets)
        setFilteredTickets(data.tickets)
        setStats(data.stats)
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

  const handleUpdateTicket = async (status?: string, message?: string) => {
    if (!selectedTicket) return

    setUpdating(true)

    try {
      const payload: any = {}
      if (status) payload.status = status
      if (message && message.trim()) payload.message = message.trim()

      const res = await fetch(`/api/admin/tickets/${selectedTicket._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Ticket updated successfully',
        })
        setReplyMessage('')
        setSelectedTicket(data.ticket)
        fetchTickets()
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to update ticket',
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
      setUpdating(false)
    }
  }

  const handleDeleteTicket = async (ticketId: string) => {
    if (!confirm('Are you sure you want to delete this ticket?')) return

    try {
      const res = await fetch(`/api/admin/tickets/${ticketId}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Ticket deleted successfully',
        })
        setSelectedTicket(null)
        fetchTickets()
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to delete ticket',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error occurred',
        variant: 'destructive',
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any; label: string }> = {
      open: { variant: 'destructive', icon: AlertCircle, label: 'Open' },
      'in-progress': { variant: 'default', icon: Clock, label: 'In Progress' },
      resolved: { variant: 'secondary', icon: CheckCircle, label: 'Resolved' },
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

    return <Badge className={colors[priority] || colors.medium}>{priority.toUpperCase()}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TicketIcon className="h-8 w-8" />
            Support Tickets
          </h1>
          <p className="text-muted-foreground mt-2">Manage and respond to student support tickets</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Tickets</CardTitle>
            <div className="text-3xl font-bold text-red-600">{stats.open}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            <div className="text-3xl font-bold text-blue-600">{stats['in-progress']}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
            <div className="text-3xl font-bold text-green-600">{stats.resolved}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Closed</CardTitle>
            <div className="text-3xl font-bold text-gray-600">{stats.closed}</div>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, student name, or description..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Academic">Academic</SelectItem>
                <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                <SelectItem value="Transport">Transport</SelectItem>
                <SelectItem value="Canteen">Canteen</SelectItem>
                <SelectItem value="Bullying">Bullying</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading tickets...</div>
          ) : filteredTickets.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">No tickets found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Replies</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow
                    key={ticket._id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <TableCell className="font-medium max-w-[300px]">
                      <div className="line-clamp-1">{ticket.title}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{ticket.studentId.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {ticket.studentId.className && `${ticket.studentId.className}-${ticket.studentId.section}`}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{ticket.category}</Badge>
                    </TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell>
                      {ticket.responses.length > 0 ? (
                        <Badge variant="secondary" className="gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {ticket.responses.length}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteTicket(ticket._id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Ticket Details Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span className="pr-4">{selectedTicket.title}</span>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedTicket.status)}
                    {getPriorityBadge(selectedTicket.priority)}
                  </div>
                </DialogTitle>
                <DialogDescription className="flex items-center gap-4 flex-wrap">
                  <Badge variant="outline">{selectedTicket.category}</Badge>
                  <span>Student: {selectedTicket.studentId.name}</span>
                  <span>Created: {new Date(selectedTicket.createdAt).toLocaleString()}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Status Update */}
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                  <Label className="font-semibold min-w-[120px]">Update Status:</Label>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant={selectedTicket.status === 'open' ? 'default' : 'outline'}
                      onClick={() => handleUpdateTicket('open')}
                      disabled={updating || selectedTicket.status === 'open'}
                    >
                      Open
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedTicket.status === 'in-progress' ? 'default' : 'outline'}
                      onClick={() => handleUpdateTicket('in-progress')}
                      disabled={updating || selectedTicket.status === 'in-progress'}
                    >
                      In Progress
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedTicket.status === 'resolved' ? 'default' : 'outline'}
                      onClick={() => handleUpdateTicket('resolved')}
                      disabled={updating || selectedTicket.status === 'resolved'}
                    >
                      Resolved
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedTicket.status === 'closed' ? 'default' : 'outline'}
                      onClick={() => handleUpdateTicket('closed')}
                      disabled={updating || selectedTicket.status === 'closed'}
                    >
                      Closed
                    </Button>
                  </div>
                </div>

                {/* Student Info */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold mb-2">Student Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>{' '}
                      <span className="font-medium">{selectedTicket.studentId.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>{' '}
                      <span className="font-medium">{selectedTicket.studentId.email}</span>
                    </div>
                    {selectedTicket.studentId.className && (
                      <div>
                        <span className="text-muted-foreground">Class:</span>{' '}
                        <span className="font-medium">
                          {selectedTicket.studentId.className}-{selectedTicket.studentId.section}
                        </span>
                      </div>
                    )}
                    {selectedTicket.studentId.rollNo && (
                      <div>
                        <span className="text-muted-foreground">Roll No:</span>{' '}
                        <span className="font-medium">{selectedTicket.studentId.rollNo}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Issue Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                    {selectedTicket.description}
                  </p>
                </div>

                {/* Responses */}
                {selectedTicket.responses.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Conversation History</h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {selectedTicket.responses.map((response, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg ${
                            response.isAdmin
                              ? 'bg-blue-50 border border-blue-200 ml-8'
                              : 'bg-gray-50 border border-gray-200 mr-8'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium flex items-center gap-2">
                                {response.respondedBy.name}
                                <Badge variant={response.isAdmin ? 'default' : 'outline'} className="text-xs">
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

                {/* Reply Box */}
                <div className="border-t pt-4">
                  <Label htmlFor="admin-reply" className="font-semibold">
                    Add Response
                  </Label>
                  <Textarea
                    id="admin-reply"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your response to the student..."
                    rows={4}
                    className="mt-2"
                  />
                  <Button
                    onClick={() => handleUpdateTicket(undefined, replyMessage)}
                    disabled={updating || !replyMessage.trim()}
                    className="mt-2"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {updating ? 'Sending...' : 'Send Response'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
