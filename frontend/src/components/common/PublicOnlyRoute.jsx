import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);
  const location = useLocation();

  // 1. Session Processing Overlay Gate
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-deep-black text-muted-gray font-heading text-xs tracking-widest gap-3 select-none">
        <Loader2 size={24} className="animate-spin text-primary-gold" />
        <span>EVALUATING VISITOR SESSION SYNC...</span>
      </div>
    );
  }

  // 2. Active Session Interception Redirect Loops
  if (isAuthenticated) {
    // If an admin accidentally attempts to hit a public login gateway, loop them into the admin hub
    if (isAdmin) {
      return <Navigate to="/admin" replace />;
    }
    
    // Check if the router has a stored prior intended landing route; if not, route back to consumer dashboard
    const targetDestination = location.state?.from?.pathname || "/account/profile";
    return <Navigate to={targetDestination} replace />;
  }

  // 3. Guest Pass-Through
  return children;
};

export default PublicOnlyRoute;