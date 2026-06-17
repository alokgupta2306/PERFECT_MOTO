import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);
  const location = useLocation();

  // 1. Session Loading Guardrail
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-deep-black text-muted-gray font-heading text-xs tracking-widest gap-3 select-none">
        <Loader2 size={24} className="animate-spin text-primary-gold" />
        <span>VERIFYING RIDER PROFILE SESSION...</span>
      </div>
    );
  }

  // 2. Security Separation Filter (Rule 4 & Section 03 Guardrails)
  // Kick an administrator away from customer account portals directly to the back-office cockpit
  if (isAuthenticated && isAdmin) {
    console.warn("⚠️ Administrative terminal session bypassed customer route context.");
    return <Navigate to="/admin" replace />;
  }

  // 3. Authentication Enforcement
  // If no active session exists, redirect to login while capturing location state maps
  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;