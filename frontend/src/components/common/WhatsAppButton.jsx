import React from "react";
import { MessageSquare } from "lucide-react";

const WhatsAppButton = ({ 
  phoneNumber = "919876543210", 
  message = "Hello PerfectMoto, I require emergency support regarding accessory compatibility setups.",
  label = "Chat With Support" 
}) => {
  const handleUrlRedirect = () => {
    const encodedString = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedString}`, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleUrlRedirect}
      className="inline-flex items-center justify-center gap-2 h-9 px-4 bg-success-green hover:bg-success-green/90 text-deep-black font-heading font-extrabold text-[11px] uppercase tracking-wider rounded-lg shadow-lg transition-all"
    >
      <MessageSquare size={14} fill="currentColor" />
      <span>{label}</span>
    </button>
  );
};

export default WhatsAppButton;