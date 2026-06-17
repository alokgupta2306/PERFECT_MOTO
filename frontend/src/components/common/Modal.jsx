import React, { useEffect } from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscapeKey);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-black/70 backdrop-blur-sm animate-fade-in">
      <div className={`w-full ${maxWidth} bg-card-dark border border-border-dark rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}>
        
        {/* Header Terminal Modal */}
        <div className="p-4 border-b border-border-dark bg-deep-black/20 flex justify-between items-center shrink-0">
          <h3 className="font-heading font-bold uppercase tracking-wide text-xs text-primary-gold">{title}</h3>
          <button onClick={onClose} className="text-muted-gray hover:text-pure-white p-1"><X size={16} /></button>
        </div>

        {/* Content Body Container */}
        <div className="p-5 overflow-y-auto custom-scrollbar text-xs text-muted-gray">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Modal;