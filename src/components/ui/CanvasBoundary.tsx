import { Component, type ErrorInfo, type ReactNode } from 'react'

/**
 * If anything inside a WebGL subtree fails — a lost context, a driver quirk, an
 * unsupported extension — we swallow it and render the photographic fallback.
 * The site must never show a broken or blank hero.
 */
export class CanvasBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode; onError?: () => void },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Visible in the console for debugging, but never surfaced to the visitor.
    console.warn('[LUMIÈRE] 3D layer disabled:', error?.message, info?.componentStack?.slice(0, 120))
    this.props.onError?.()
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null
    return this.props.children
  }
}
