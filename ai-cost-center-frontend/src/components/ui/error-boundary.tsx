'use client'

import { Component, type ReactNode } from 'react'
import { Button } from './button'
import { AlertTriangle } from 'lucide-react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <AlertTriangle className="mb-3 h-8 w-8 text-destructive" />
          <p className="text-sm font-medium">Something went wrong</p>
          <p className="mt-1 text-xs text-muted-foreground/70">{this.state.error?.message}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => this.setState({ hasError: false })}>Try again</Button>
        </div>
      )
    }
    return this.props.children
  }
}
