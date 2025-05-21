/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
"use client";

import { Component, ErrorInfo, ReactNode } from "react";

interface Properties {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Properties, State> {
  constructor(properties: Properties) {
    super(properties);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by Error Boundary:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg bg-gray-100 p-6 shadow-md">
          <h2 className="text-xl font-semibold text-red-600">Something went wrong.</h2>
          <p className="text-gray-600">Please try again.</p>
          <button
            onClick={this.handleRetry}
            className="mt-4 rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
