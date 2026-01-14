'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="p-8 text-center border-destructive/50 bg-destructive/5">
          <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            An unexpected error occurred. Please try again.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="text-xs text-left bg-muted p-4 rounded mb-4 overflow-auto max-h-32">
              {this.state.error.message}
            </pre>
          )}
          <Button onClick={this.handleRetry} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </Card>
      )
    }

    return this.props.children
  }
}

// Hook-based error boundary for async errors
export function useErrorHandler() {
  const handleError = (error: Error) => {
    console.error('Handled error:', error)
    // You could integrate with error reporting service here
  }

  return { handleError }
}
