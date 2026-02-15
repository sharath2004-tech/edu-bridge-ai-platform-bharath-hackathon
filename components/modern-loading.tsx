
interface ModernLoadingProps {
  message?: string
  fullscreen?: boolean
}

export function ModernLoading({ message = "Loading...", fullscreen = false }: ModernLoadingProps) {
  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-4 border-primary/20"></div>
            <div className="absolute top-0 h-20 w-20 animate-spin rounded-full border-4 border-transparent border-t-primary"></div>
          </div>
          <p className="text-lg font-medium text-muted-foreground animate-pulse">{message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-12">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-primary/20"></div>
          <div className="absolute top-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-primary"></div>
        </div>
        <p className="text-base font-medium text-muted-foreground animate-pulse">{message}</p>
      </div>
    </div>
  )
}

export function TableLoadingSkeleton({ rows = 5, columns = 6 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Header skeleton */}
      <div className="flex gap-4 pb-4 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-muted rounded flex-1"></div>
        ))}
      </div>
      
      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 items-center">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="h-8 bg-muted rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  )
}

export function CardLoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-6 animate-pulse">
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ListLoadingSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-lg border bg-card animate-pulse">
          <div className="h-12 w-12 rounded-full bg-muted"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-3 bg-muted rounded w-1/3"></div>
          </div>
          <div className="h-8 w-20 bg-muted rounded"></div>
        </div>
      ))}
    </div>
  )
}
