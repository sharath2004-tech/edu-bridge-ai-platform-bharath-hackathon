// Physics formulas and calculations engine for lab experiments

/**
 * Calculate current using Ohm's Law: I = V / R
 * @param voltage - Voltage in volts (V)
 * @param resistance - Resistance in ohms (Ω)
 * @returns Current in amperes (A)
 */
export function calculateCurrent(voltage: number, resistance: number): number {
  if (resistance === 0) {
    throw new Error('Resistance cannot be zero - division by zero error')
  }
  if (resistance < 0 || voltage < 0) {
    throw new Error('Voltage and resistance must be positive values')
  }
  return voltage / resistance
}

/**
 * Calculate voltage using Ohm's Law: V = I × R
 * @param current - Current in amperes (A)
 * @param resistance - Resistance in ohms (Ω)
 * @returns Voltage in volts (V)
 */
export function calculateVoltage(current: number, resistance: number): number {
  return current * resistance
}

/**
 * Calculate resistance using Ohm's Law: R = V / I
 * @param voltage - Voltage in volts (V)
 * @param current - Current in amperes (A)
 * @returns Resistance in ohms (Ω)
 */
export function calculateResistance(voltage: number, current: number): number {
  if (current === 0) {
    throw new Error('Current cannot be zero - division by zero error')
  }
  return voltage / current
}

/**
 * Generate data points for Ohm's Law graph (V vs I)
 * @param maxVoltage - Maximum voltage to plot
 * @param resistance - Fixed resistance value
 * @returns Array of voltage-current data points
 */
export function generateOhmsLawData(
  maxVoltage: number,
  resistance: number
): { voltage: number; current: number }[] {
  const dataPoints: { voltage: number; current: number }[] = []
  const steps = 20
  
  for (let i = 0; i <= steps; i++) {
    const voltage = (maxVoltage * i) / steps
    const current = calculateCurrent(voltage, resistance)
    dataPoints.push({ voltage, current })
  }
  
  return dataPoints
}

/**
 * Calculate power using P = V × I or P = I²R or P = V²/R
 * @param voltage - Voltage in volts (V)
 * @param current - Current in amperes (A)
 * @returns Power in watts (W)
 */
export function calculatePower(voltage: number, current: number): number {
  return voltage * current
}

/**
 * Calculate pendulum period using T = 2π√(L/g)
 * @param length - Length of pendulum in meters
 * @param gravity - Gravitational acceleration (default: 9.81 m/s²)
 * @returns Period in seconds
 */
export function calculatePendulumPeriod(
  length: number,
  gravity: number = 9.81
): number {
  return 2 * Math.PI * Math.sqrt(length / gravity)
}

/**
 * Calculate projectile range using R = (v₀² × sin(2θ)) / g
 * @param initialVelocity - Initial velocity in m/s
 * @param angle - Launch angle in degrees
 * @param gravity - Gravitational acceleration (default: 9.81 m/s²)
 * @returns Range in meters
 */
export function calculateProjectileRange(
  initialVelocity: number,
  angle: number,
  gravity: number = 9.81
): number {
  const angleRad = (angle * Math.PI) / 180
  return (initialVelocity * initialVelocity * Math.sin(2 * angleRad)) / gravity
}

/**
 * Calculate maximum height of projectile using H = (v₀² × sin²(θ)) / (2g)
 * @param initialVelocity - Initial velocity in m/s
 * @param angle - Launch angle in degrees
 * @param gravity - Gravitational acceleration (default: 9.81 m/s²)
 * @returns Maximum height in meters
 */
export function calculateProjectileMaxHeight(
  initialVelocity: number,
  angle: number,
  gravity: number = 9.81
): number {
  const angleRad = (angle * Math.PI) / 180
  const vy = initialVelocity * Math.sin(angleRad)
  return (vy * vy) / (2 * gravity)
}

/**
 * Calculate time of flight for projectile using T = (2v₀ × sin(θ)) / g
 * @param initialVelocity - Initial velocity in m/s
 * @param angle - Launch angle in degrees
 * @param gravity - Gravitational acceleration (default: 9.81 m/s²)
 * @returns Time of flight in seconds
 */
export function calculateProjectileTimeOfFlight(
  initialVelocity: number,
  angle: number,
  gravity: number = 9.81
): number {
  const angleRad = (angle * Math.PI) / 180
  const vy = initialVelocity * Math.sin(angleRad)
  return (2 * vy) / gravity
}

/**
 * Calculate kinetic energy using KE = (1/2)mv²
 * @param mass - Mass in kilograms
 * @param velocity - Velocity in m/s
 * @returns Kinetic energy in joules
 */
export function calculateKineticEnergy(mass: number, velocity: number): number {
  return 0.5 * mass * velocity * velocity
}

/**
 * Calculate potential energy using PE = mgh
 * @param mass - Mass in kilograms
 * @param height - Height in meters
 * @param gravity - Gravitational acceleration (default: 9.81 m/s²)
 * @returns Potential energy in joules
 */
export function calculatePotentialEnergy(
  mass: number,
  height: number,
  gravity: number = 9.81
): number {
  return mass * gravity * height
}
