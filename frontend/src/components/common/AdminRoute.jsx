import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-deep-black text-primary-gold">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted-gray border-t-primary-gold"></div>
      </div>
    );
  }

  // Kick any rogue non-admin connections straight back out to the home storefront viewport
  return isAuthenticated && isAdmin ? children : <Navigate to="/admin/login" replace />;
};

export default AdminRoute;