import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App.jsx";
import "./index.css";

// Global Structural Layout State Context Providers
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// ✅ IMPORT: Google OAuth initialization block wrapper
import { GoogleOAuthProvider } from "@react-oauth/google";

// Sourced the crash barrier shell to isolate component execution exceptions
import ErrorBoundary from "./components/common/ErrorBoundary";

// ============================================================================
// 📊 RULE 9: INITIALIZE REAL-TIME SENTRY CRASH TRACKING OVERLAYS
// ============================================================================
// Checking explicitly against fallback placeholder text to prevent the "Invalid Sentry Dsn" warning
if (import.meta.env.VITE_SENTRY_DSN && import.meta.env.VITE_SENTRY_DSN !== "your_sentry_dsn_here") {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0, 
    tracePropagationTargets: ["localhost", /^https:\/\/api\.perfectmoto\.in/],
    replaysSessionSampleRate: 0.1, 
    replaysOnErrorSampleRate: 1.0, 
  });
}

// Extract the client identity token smoothly out of environment allocations
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

// ============================================================================
// 🚀 MASTER WRAPPER PROVIDER HIERARCHICAL PRIORITY ORDER
// ============================================================================
// 1. Theme Provider: Controls light/dark class properties globally first.
// 2. Auth Provider: Generates user data frames and session states second.
// 3. Google OAuth Provider: Supplies authentication context parameters third.
// 4. Cart Provider: Uses user context data hooks to reconcile local item arrays fourth.
// 5. Error Boundary: Wraps the core App routing to intercept and log rendering crashes.
// ============================================================================
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <CartProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </CartProvider>
        </GoogleOAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);