"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/** Error boundary with Endgame-dark fallback UI. */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            role="alert"
            className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-red-500/10 bg-[#0a0d1a] p-12 text-center"
          >
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
              <AlertTriangle className="h-10 w-10 text-red-400/60" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-200">
                Something Went Wrong
              </h2>
              <p className="mt-2 text-xs text-slate-500">
                We couldn&apos;t load this content. Please try refreshing.
              </p>
            </div>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-violet-300 transition-all hover:bg-violet-500/20 hover:border-violet-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              Try Again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
