import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type AnimationType = 
  | "slideInLeft" 
  | "slideInRight" 
  | "slideInUp" 
  | "slideInBottom" 
  | "fadeIn" 
  | "zoomIn" 
  | "scaleIn"

interface AnimatedCardProps {
  children: ReactNode
  delay?: number
  className?: string
  animation?: AnimationType
  hover?: boolean
}

export function AnimatedCard({ 
  children, 
  delay = 0, 
  className, 
  animation = "slideInLeft",
  hover = true 
}: AnimatedCardProps) {
  const animationClass = {
    slideInLeft: "animate-slideInLeft",
    slideInRight: "animate-slideInRight",
    slideInUp: "animate-slideInUp",
    slideInBottom: "animate-slideInBottom",
    fadeIn: "animate-fadeIn",
    zoomIn: "animate-zoomIn",
    scaleIn: "animate-scaleIn",
  }[animation]

  return (
    <div 
      className={cn(
        animationClass, 
        hover && "transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        className
      )} 
      style={{ animationDelay: `${delay}s`, animationFillMode: 'both' }}
    >
      {children}
    </div>
  )
}
