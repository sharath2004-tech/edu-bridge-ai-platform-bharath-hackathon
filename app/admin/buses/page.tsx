'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { Bus, Plus, Trash2, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function AdminBusesPage() {
  const [buses, setBuses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [busToDelete, setBusToDelete] = useState<any>(null)
  const [creating, setCreating] = useState(false)
  const { toast } = useToast()

  const [newBus, setNewBus] = useState({
    busNumber: '',
    routeName: '',
    capacity: '',
    driverName: '',
    driverPhone: ''
  })

  useEffect(() => {
    fetchBuses()
  }, [])

  const fetchBuses = async () => {
    try {
      const res = await fetch('/api/admin/buses')
      const data = await res.json()
      if (data.success) {
        setBuses(data.buses)
      }
    } catch (error) {
      console.error('Failed to fetch buses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBus = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      const res = await fetch('/api/admin/buses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          busNumber: newBus.busNumber.toUpperCase(),
          routeName: newBus.routeName,
          capacity: parseInt(newBus.capacity),
          driverName: newBus.driverName || undefined,
          driverPhone: newBus.driverPhone || undefined
        })
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Bus created successfully'
        })
        setIsCreateDialogOpen(false)
        setNewBus({
          busNumber: '',
          routeName: '',
          capacity: '',
          driverName: '',
          driverPhone: ''
        })
        fetchBuses()
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to create bus',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error occurred',
        variant: 'destructive'
      })
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteBus = async () => {
    if (!busToDelete) return

    try {
      const res = await fetch(`/api/admin/buses?id=${busToDelete._id}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Bus deleted successfully'
        })
        fetchBuses()
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to delete bus',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error occurred',
        variant: 'destructive'
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setBusToDelete(null)
    }
  }

  if (loading) {
    return <div className="p-8">Loading buses...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bus className="h-8 w-8" />
            Bus Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage school buses and routes
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Bus
        </Button>
      </div>

      {/* Buses List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">School Buses ({buses.length})</h2>
          </div>
        </CardHeader>
        <CardContent>
          {buses.length === 0 ? (
            <div className="text-center py-12">
              <Bus className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No buses yet</h3>
              <p className="text-muted-foreground">Get started by adding your first bus route.</p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add First Bus
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bus Number</TableHead>
                  <TableHead>Route Name</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buses.map((bus) => (
                  <TableRow key={bus._id}>
                    <TableCell className="font-medium">{bus.busNumber}</TableCell>
                    <TableCell>{bus.routeName}</TableCell>
                    <TableCell>{bus.capacity}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className={bus.studentCount > bus.capacity ? 'text-red-600 font-semibold' : ''}>
                          {bus.studentCount}
                        </span>
                        {bus.studentCount > bus.capacity && (
                          <Badge variant="destructive" className="ml-1">Overcapacity</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{bus.driverName || '-'}</TableCell>
                    <TableCell>{bus.driverPhone || '-'}</TableCell>
                    <TableCell>
                      {bus.isActive ? (
                        <Badge variant="default">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setBusToDelete(bus)
                          setIsDeleteDialogOpen(true)
                        }}
                        disabled={bus.studentCount > 0}
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

      {/* Create Bus Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Bus</DialogTitle>
            <DialogDescription>
              Create a new bus route for your school.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateBus}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="busNumber">Bus Number *</Label>
                <Input
                  id="busNumber"
                  value={newBus.busNumber}
                  onChange={(e) => setNewBus({ ...newBus, busNumber: e.target.value.toUpperCase() })}
                  placeholder="BUS-001"
                  required
                />
              </div>

              <div>
                <Label htmlFor="routeName">Route Name *</Label>
                <Input
                  id="routeName"
                  value={newBus.routeName}
                  onChange={(e) => setNewBus({ ...newBus, routeName: e.target.value })}
                  placeholder="North Route - Downtown"
                  required
                />
              </div>

              <div>
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  max="100"
                  value={newBus.capacity}
                  onChange={(e) => setNewBus({ ...newBus, capacity: e.target.value })}
                  placeholder="40"
                  required
                />
              </div>

              <div>
                <Label htmlFor="driverName">Driver Name (Optional)</Label>
                <Input
                  id="driverName"
                  value={newBus.driverName}
                  onChange={(e) => setNewBus({ ...newBus, driverName: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="driverPhone">Driver Phone (Optional)</Label>
                <Input
                  id="driverPhone"
                  type="tel"
                  value={newBus.driverPhone}
                  onChange={(e) => setNewBus({ ...newBus, driverPhone: e.target.value })}
                  placeholder="+1-555-0100"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? 'Creating...' : 'Create Bus'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Bus?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{busToDelete?.busNumber}</strong>?
              {busToDelete?.studentCount > 0 && (
                <div className="mt-2 text-red-600 font-semibold">
                  Cannot delete: {busToDelete.studentCount} student(s) are assigned to this bus.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBus}
              disabled={busToDelete?.studentCount > 0}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
