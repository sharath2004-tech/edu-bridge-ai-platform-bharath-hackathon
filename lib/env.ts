/**
 * Environment variable validation
 * This module validates required environment variables on startup
 */

interface EnvConfig {
  name: string
  required: boolean
  default?: string
}

const envConfig: EnvConfig[] = [
  { name: 'MONGODB_URI', required: true },
  { name: 'NODE_ENV', required: false, default: 'development' },
  { name: 'COHERE_API_KEY', required: false },
  { name: 'NEXT_PUBLIC_APP_URL', required: false, default: 'http://localhost:3000' },
]

export function validateEnv(): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  for (const env of envConfig) {
    const value = process.env[env.name]
    
    if (env.required && !value) {
      errors.push(`Missing required environment variable: ${env.name}`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function getEnv(name: string, defaultValue?: string): string {
  const value = process.env[name]
  
  if (!value && defaultValue !== undefined) {
    return defaultValue
  }
  
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`)
  }
  
  return value
}

export function getOptionalEnv(name: string, defaultValue: string = ''): string {
  return process.env[name] || defaultValue
}

// Check environment on module load in development
if (process.env.NODE_ENV === 'development') {
  const { valid, errors } = validateEnv()
  
  if (!valid) {
    console.warn('⚠️  Environment validation warnings:')
    errors.forEach(error => console.warn(`   - ${error}`))
  }
}
