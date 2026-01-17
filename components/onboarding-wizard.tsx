'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ArrowLeft, GraduationCap, School, Users, Video, Wifi, CheckCircle, Copy } from 'lucide-react'
import { useRouter } from 'next/navigation'

type WizardPath = 'demo' | 'register' | null

interface OnboardingWizardProps {
  triggerOpen?: boolean
}

export default function OnboardingWizard({ triggerOpen }: OnboardingWizardProps = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [path, setPath] = useState<WizardPath>(null)
  const router = useRouter()

  useEffect(() => {
    if (triggerOpen) {
      setIsOpen(true)
      setPath(null)
      setCurrentSlide(0)
      return
    }
    
    const hasSeenWizard = localStorage.getItem('onboarding_completed')
    if (!hasSeenWizard) {
      setIsOpen(true)
    }
  }, [triggerOpen])

  const handleClose = () => {
    localStorage.setItem('onboarding_completed', 'true')
    setIsOpen(false)
    setPath(null)
    setCurrentSlide(0)
  }

  const handleSkip = () => {
    handleClose()
  }

  const handleNext = () => {
    if (path === 'demo' && currentSlide === demoSlides.length - 1) {
      handleClose()
      router.push('/login')
    } else if (path === 'register' && currentSlide === registerSlides.length - 1) {
      handleClose()
      router.push('/school-registration')
    } else {
      setCurrentSlide(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentSlide === 0 && path) {
      setPath(null)
    } else {
      setCurrentSlide(prev => prev - 1)
    }
  }

  const selectPath = (selectedPath: WizardPath) => {
    setPath(selectedPath)
    setCurrentSlide(0)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const demoSlides = [
    {
      title: '🎓 Green Valley High School - Demo Access',
      content: (
        <div className="space-y-6">
          <p className="text-muted-foreground">Try different roles to explore the full platform capabilities:</p>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-700 dark:text-blue-400">🔵 Super Admin</h4>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard('superadmin@edubridge.com')}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-sm mb-2">Email: superadmin@edubridge.com</p>
              <p className="text-sm mb-2">Password: superadmin123</p>
              <p className="text-xs text-muted-foreground">→ Manage multiple schools, approve registrations</p>
            </div>

            <div className="border rounded-lg p-4 bg-purple-50 dark:bg-purple-950/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-purple-700 dark:text-purple-400">👨‍💼 Principal</h4>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard('robert.anderson@greenvalley.edu')}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-sm mb-2">Email: robert.anderson@greenvalley.edu</p>
              <p className="text-sm mb-2">Password: principal123</p>
              <p className="text-xs text-muted-foreground">→ Manage teachers, students, and classes</p>
            </div>

            <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-700 dark:text-green-400">👩‍🏫 Teacher</h4>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard('sarah.johnson@greenvalley.edu')}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-sm mb-2">Email: sarah.johnson@greenvalley.edu</p>
              <p className="text-sm mb-2">Password: teacher123</p>
              <p className="text-xs text-muted-foreground">→ Create courses, upload videos, grade students</p>
            </div>

            <div className="border rounded-lg p-4 bg-orange-50 dark:bg-orange-950/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-orange-700 dark:text-orange-400">👨‍🎓 Student</h4>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard('student1.9th.a@student.edu')}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-sm mb-2">Email: student1.9th.a@student.edu</p>
              <p className="text-sm mb-2">Password: student123</p>
              <p className="text-xs text-muted-foreground">→ Watch videos offline, take quizzes, view marks</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '🎯 What You Can Explore',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground mb-6">Discover all the powerful features of EduBridge AI:</p>
          
          <div className="space-y-3">
            {[
              '📹 Video Learning - Watch how offline video works (try downloading!)',
              '📚 Course Creation - See how teachers build engaging courses',
              '🤖 AI Analytics - Check the dashboard insights and reports',
              '🏫 Multi-School Management - See super admin controls',
              '📱 Offline Access - Test offline mode in your browser',
              '✅ Teacher Assignment - Assign teachers to classes',
              '📊 Progress Tracking - Monitor student performance'
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ]

  const registerSlides = [
    {
      title: '🏫 School Registration Process',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-semibold">School Details</h4>
                  <p className="text-sm text-muted-foreground">Fill registration form with school info</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-semibold">Super Admin Review</h4>
                  <p className="text-sm text-muted-foreground">Admin reviews your school in the platform</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-semibold">Approval & Access</h4>
                  <p className="text-sm text-muted-foreground">Get approved and start using the platform</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <p className="text-sm font-medium mb-1">📧 Email Notifications</p>
            <p className="text-sm text-muted-foreground">You'll receive notifications at each step</p>
          </div>
        </div>
      )
    },
    {
      title: "📋 What You'll Need",
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground mb-4">Keep these details ready before starting:</p>
          
          <div className="space-y-3">
            {[
              { icon: School, text: 'School Name & Complete Address' },
              { icon: GraduationCap, text: 'Board Registration Number (CBSE/ICSE/State)' },
              { icon: Users, text: "Principal's Contact (Name, Email, Phone)" },
              { icon: Video, text: 'School Type & Board Affiliation' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                <item.icon className="w-5 h-5 text-primary" />
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">💡 Tip</p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">Have all these details ready to complete registration smoothly!</p>
          </div>
        </div>
      )
    },
    {
      title: '🎯 Platform Features',
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-500" />
                Video Learning
              </h4>
              <p className="text-sm text-muted-foreground">Teachers upload videos, students can download and watch offline</p>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Wifi className="w-5 h-5 text-green-500" />
                Offline Mode
              </h4>
              <p className="text-sm text-muted-foreground">Students can access content without internet after downloading</p>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                Role-Based Access
              </h4>
              <p className="text-sm text-muted-foreground">Secure permissions for principals, teachers, and students</p>
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">✅ Perfect for rural areas!</p>
            <p className="text-sm text-green-700 dark:text-green-300">Students with limited internet can download and learn offline</p>
          </div>
        </div>
      )
    }
  ]

  const slides = path === 'demo' ? demoSlides : path === 'register' ? registerSlides : []
  const totalSlides = slides.length

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {!path ? (
          // Welcome Screen
          <>
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-center">
                Welcome to EduBridge AI! 🎓
              </DialogTitle>
              <DialogDescription className="text-center text-lg">
                Transform education with AI-powered learning. Let's get you started!
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-6">
              <div className="grid gap-4">
                <Button
                  size="lg"
                  className="h-auto py-6 text-left justify-start"
                  onClick={() => selectPath('demo')}
                >
                  <div className="flex items-start gap-4 w-full">
                    <div className="text-4xl">🎬</div>
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1">Try Demo School</div>
                      <div className="text-sm opacity-90">Explore with pre-loaded data • No setup needed</div>
                    </div>
                    <ArrowRight className="w-5 h-5 mt-2" />
                  </div>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="h-auto py-6 text-left justify-start"
                  onClick={() => selectPath('register')}
                >
                  <div className="flex items-start gap-4 w-full">
                    <div className="text-4xl">🚀</div>
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1">Create New School</div>
                      <div className="text-sm opacity-90">Start fresh with your school • Quick setup</div>
                    </div>
                    <ArrowRight className="w-5 h-5 mt-2" />
                  </div>
                </Button>
              </div>

              <div className="text-center">
                <Button variant="ghost" onClick={handleSkip}>
                  Skip Tour
                </Button>
              </div>
            </div>
          </>
        ) : (
          // Slides
          <>
            <DialogHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">
                  Step {currentSlide + 1} of {totalSlides}
                </Badge>
                <Button variant="ghost" size="sm" onClick={handleSkip}>
                  Skip Tour
                </Button>
              </div>
              <DialogTitle className="text-2xl">{slides[currentSlide].title}</DialogTitle>
            </DialogHeader>

            <div className="py-6">
              {slides[currentSlide].content}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentSlide === 0 && !path}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {currentSlide === 0 ? 'Back' : 'Previous'}
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all ${
                      i === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-muted'
                    }`}
                  />
                ))}
              </div>

              <Button onClick={handleNext}>
                {currentSlide === totalSlides - 1 ? (
                  path === 'demo' ? 'Start Exploring' : 'Start Registration'
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
