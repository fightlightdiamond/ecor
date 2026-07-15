"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"

type Props = {
  blockType: string
  children: ReactNode
}

type State = {
  hasError: boolean
}

/** Per-block error boundary — a bad block must not crash the whole page. */
export default class BlockErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[BlockErrorBoundary] ${this.props.blockType}`, error, info)
  }

  render() {
    if (this.state.hasError) {
      return null
    }

    return this.props.children
  }
}
