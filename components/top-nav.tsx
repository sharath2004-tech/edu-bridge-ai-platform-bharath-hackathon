"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { formatDistanceToNow } from "date-fns"
import { Bell, Check, ChevronRight, Loader2, LogOut, Search, Settings, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

interface Notification {
  _id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
  actionUrl?: string
}

interface UserProfile {
  _id: string
  name: string
  email: string
  role: string
  avatar?: string
  schoolId?: {
    name: string
  }
}

function getNotificationIcon(type: string): string {
  switch (type) {
    case 'course_added':
      return '📚'
    case 'course_updated':
      return '📖'
    case 'marks_update':
      return '📝'
    case 'quiz_added':
      return '❓'
    case 'assignment':
      return '📋'
    case 'attendance_alert':
      return '⚠️'
    case 'student_registration':
      return '👤'
    case 'announcement':
      return '📢'
    default:
      return '🔔'
  }
}

export function TopNav() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loadingNotifications, setLoadingNotifications] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [markingRead, setMarkingRead] = useState<string | null>(null)

  // Fetch user profile
  const fetchUser = useCallback(async () => {
    try {
      setLoadingUser(true)
      const res = await fetch('/api/users/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setLoadingUser(false)
    }
  }, [])

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoadingNotifications(true)
      const res = await fetch('/api/notifications?limit=10')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoadingNotifications(false)
    }
  }, [])

  // Mark notification as read
  const markAsRead = async (notificationId: string, actionUrl?: string) => {
    try {
      setMarkingRead(notificationId)
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: [notificationId] })
      })
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
      
      // Navigate if there's an action URL
      if (actionUrl) {
        setNotificationOpen(false)
        router.push(actionUrl)
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    } finally {
      setMarkingRead(null)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.isRead).map(n => n._id)
      if (unreadIds.length === 0) return

      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: unreadIds })
      })
      
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Error logging out:', error)
      router.push('/login')
    }
  }

  // Get settings URL based on role
  const getSettingsUrl = () => {
    if (!user) return '/login'
    const roleRoutes: Record<string, string> = {
      student: '/student/settings',
      teacher: '/teacher/settings',
      principal: '/principal/settings',
      admin: '/admin/settings',
      'super-admin': '/super-admin/settings'
    }
    return roleRoutes[user.role] || '/login'
  }

  // Initial fetch
  useEffect(() => {
    fetchUser()
    fetchNotifications()
  }, [fetchUser, fetchNotifications])

  // Refresh notifications when popover opens
  useEffect(() => {
    if (notificationOpen) {
      fetchNotifications()
    }
  }, [notificationOpen, fetchNotifications])

  // Periodic refresh for notifications (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-500/10 text-blue-500'
      case 'teacher': return 'bg-green-500/10 text-green-500'
      case 'principal': return 'bg-purple-500/10 text-purple-500'
      case 'admin': return 'bg-orange-500/10 text-orange-500'
      case 'super-admin': return 'bg-red-500/10 text-red-500'
      default: return 'bg-gray-500/10 text-gray-500'
    }
  }

  return (
    <header className="sticky top-0 z-30 w-full bg-background/95 backdrop-blur border-b border-border">
      <div className="ml-0 lg:ml-64 px-6 h-16 flex items-center justify-between gap-4">
        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search courses, topics..." className="pl-10 bg-muted/50" />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Notifications */}
          <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost" className="relative hover:bg-muted/50 transition-all duration-200">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between p-4 border-b">
                <h4 className="font-semibold text-sm">Notifications</h4>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-muted-foreground hover:text-foreground"
                    onClick={markAllAsRead}
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Mark all read
                  </Button>
                )}
              </div>
              <ScrollArea className="h-[300px]">
                {loadingNotifications ? (
                  <div className="flex items-center justify-center h-20">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-20 text-muted-foreground">
                    <Bell className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`p-3 cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                          !notification.isRead ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => markAsRead(notification._id, notification.actionUrl)}
                      >
                        <div className="flex gap-3">
                          <span className="text-xl flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm font-medium truncate ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {notification.title}
                              </p>
                              {markingRead === notification._id && (
                                <Loader2 className="w-3 h-3 animate-spin flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground/70 mt-1">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              {notifications.length > 0 && (
                <div className="p-2 border-t">
                  <Button 
                    variant="ghost" 
                    className="w-full text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setNotificationOpen(false)
                      router.push(`/${user?.role}/notifications`)
                    }}
                  >
                    View all notifications
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>

          {/* Profile */}
          <Popover open={profileOpen} onOpenChange={setProfileOpen}>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost" className="relative hover:bg-muted/50 transition-all duration-200">
                {user?.avatar ? (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-xs">
                      {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="w-5 h-5" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" align="end">
              {loadingUser ? (
                <div className="flex items-center justify-center h-24">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : user ? (
                <>
                  {/* Profile Header */}
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 ring-2 ring-background shadow-lg">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                          {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        <Badge className={`mt-1 text-xs capitalize ${getRoleBadgeColor(user.role)}`}>
                          {user.role.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                    {user.schoolId?.name && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <p className="text-xs text-muted-foreground">
                          🏫 {user.schoolId.name}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {/* Actions */}
                  <div className="p-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-sm"
                      onClick={() => {
                        setProfileOpen(false)
                        router.push(getSettingsUrl())
                      }}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Not logged in</p>
                  <Button 
                    variant="default" 
                    size="sm"
                    className="mt-2"
                    onClick={() => router.push('/login')}
                  >
                    Login
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  )
}
