import React, { useEffect } from "react";
import { CheckCircle2, AlertTriangle, X, Info } from "lucide-react";

const Toast = ({ message, type = "success", onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const themes = {
    success: "border-success-green bg-card-dark text-success-green shadow-success-green/5",
    error: "border-error-red bg-card-dark text-error-red shadow-error-red/5",
    info: "border-primary-gold bg-card-dark text-primary-gold shadow-primary-gold/5"
  };

  const icons = {
    success: <CheckCircle2 size={16} />,
    error: <AlertTriangle size={16} />,
    info: <Info size={16} />
  };

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 p-4 border rounded-xl shadow-2xl max-w-sm animate-fade-in text-xs font-semibold uppercase tracking-wider ${themes[type]}`}>
      <span className="shrink-0">{icons[type]}</span>
      <p className="text-pure-white flex-1 normal-case tracking-normal font-medium">{message}</p>
      <button onClick={onClose} className="text-muted-gray hover:text-pure-white p-0.5 transition-colors">
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;