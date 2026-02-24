// Lab experiment data types

export interface PendulumData {
  length: number
  angle: number
  simulatedPeriod: number
  theoreticalPeriod: number
  error: number
  gravity: number
}

export interface OhmsLawData {
  voltage: number
  resistance: number
  current: number
  graphData: { voltage: number; current: number }[]
}

export interface ReactivityData {
  metal: string
  acid: string
  reactionOccurs: boolean
  hydrogenReleased: boolean
  reactivityPosition: number
  observation: string
}

export interface NeutralizationData {
  acid: string
  base: string
  balancedEquation: string
  reactionType: string
  temperatureChange: number
  initialPH: number
  finalPH: number
  products: string[]
}

export interface AIAnalysis {
  understanding: number
  misconceptions: string[]
  suggestions: string[]
  nextSteps: string[]
}
