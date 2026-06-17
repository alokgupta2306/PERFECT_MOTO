import React, { Component } from "react";
import * as Sentry from "@sentry/react";
import { ShieldAlert, RefreshCw, Home } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorLog: null };
  }

  // Intercept the processing crash anomaly state before unmounting
  static getDerivedStateFromError(error) {
    return { hasError: true, errorLog: error };
  }

  // Implement componentDidCatch to stream trace logs to Sentry
  componentDidCatch(error, errorInfo) {
    console.error("System Matrix Runtime Crash Intercepted:", error, errorInfo);
    
    // Captures the contextual crash profile securely via Sentry overlays[cite: 1]
    if (import.meta.env.VITE_SENTRY_DSN) {
      Sentry.withScope((scope) => {
        scope.setExtra("componentStack", errorInfo.componentStack);
        Sentry.captureException(error);
      });
    }
  }

  handleResetFallbackState = () => {
    this.setState({ hasError: false, errorLog: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // Premium Black & Gold Fallback Page Layout (GAP 7 Specification)[cite: 1]
      return (
        <div className="min-h-screen bg-deep-black flex items-center justify-center p-4 font-body text-xs text-muted-gray select-none">
          <div className="max-w-md w-full bg-card-dark border border-border-dark p-8 rounded-xl shadow-gold-glow text-center space-y-6">
            
            {/* Warning Shield Alert Frame */}
            <div className="mx-auto h-14 w-14 bg-error-red/10 text-error-red border border-error-red/20 rounded-full flex items-center justify-center animate-bounce">
              <ShieldAlert size={28} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-heading font-bold text-primary-gold uppercase tracking-wider">
                System Interface Interrupted
              </h2>
              <p className="leading-relaxed font-medium normal-case">
                Your frontend pipeline encountered a runtime trace compilation error. The session crash telemetry log has been broadcast to our Sentry monitoring stack for isolation[cite: 1].
              </p>
            </div>

            {/* Debugging Trace Panel Container (Only rendered inside Development Mode Sandbox) */}
            {process.env.NODE_ENV !== "production" && this.state.errorLog && (
              <div className="p-3 bg-deep-black border border-border-dark rounded-lg text-left overflow-x-auto max-h-32 font-mono text-[10px] text-error-red/80 normal-case">
                {this.state.errorLog.toString()}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="h-10 border border-border-dark hover:border-pure-white text-pure-white flex items-center justify-center gap-1.5 rounded-lg font-heading font-bold uppercase tracking-wider transition-all text-xs"
              >
                <RefreshCw size={12} />
                <span>Reload App</span>
              </button>
              
              <button
                type="button"
                onClick={this.handleResetFallbackState}
                className="h-10 bg-primary-gold hover:bg-gold-hover text-deep-black flex items-center justify-center gap-1.5 rounded-lg font-heading font-bold uppercase tracking-wider transition-all text-xs shadow-lg shadow-gold-glow/5"
              >
                <Home size={12} />
                <span>Go Home</span>
              </button>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;