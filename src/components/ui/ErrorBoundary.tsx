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

/** Error boundary that catches render errors and shows a friendly fallback. */
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
            className="flex flex-col items-center justify-center gap-4 rounded-xl border border-red-500/20 bg-red-500/5 p-12 text-center"
          >
            <AlertTriangle className="h-12 w-12 text-red-400" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-semibold text-slate-100">
                Something went wrong
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                We couldn&apos;t load this content. Please try refreshing the page.
              </p>
            </div>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
