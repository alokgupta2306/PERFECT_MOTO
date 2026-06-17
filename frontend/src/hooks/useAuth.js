import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// ✅ Simple, clean hook consumer pointing directly to AuthContext
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be consumed inside an AuthProvider wrapper matrix.");
  }
  return context;
};

export default useAuth;