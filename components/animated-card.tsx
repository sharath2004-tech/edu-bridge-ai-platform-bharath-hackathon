import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface AnimatedCardProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function AnimatedCard({ children, delay = 0, className }: AnimatedCardProps) {
  return (
    <div className={cn("animate-slideInLeft", className)} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  )
}
