'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { HelpCircle } from 'lucide-react'
import OnboardingWizard from './onboarding-wizard'

export default function OnboardingButton() {
  const [triggerOpen, setTriggerOpen] = useState(false)

  const handleOpenWizard = () => {
    setTriggerOpen(true)
    setTimeout(() => setTriggerOpen(false), 100)
  }

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={handleOpenWizard}
        className="gap-2"
      >
        <HelpCircle className="w-4 h-4" />
        <span className="hidden sm:inline">Take a Tour</span>
      </Button>
      <OnboardingWizard triggerOpen={triggerOpen} />
    </>
  )
}
