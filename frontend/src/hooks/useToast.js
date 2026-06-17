import { useState, useCallback } from "react";

const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success", duration = 4000) => {
    setToast({ message, type, duration });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return {
    toast,
    showToast,
    hideToast
  };
};

export default useToast;