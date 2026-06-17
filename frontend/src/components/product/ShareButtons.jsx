import React, { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";

const ShareButtons = ({ assetTitle = "PerfectMoto Component Hardware" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyTrigger = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-muted-gray">Reference Portal Link:</span>
      <button
        onClick={handleCopyTrigger}
        className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-heading font-bold uppercase tracking-wider border rounded-md transition-colors h-7 ${
          copied 
            ? "bg-success-green/10 border-success-green text-success-green" 
            : "bg-card-dark border-border-dark text-muted-gray hover:text-pure-white hover:border-muted-gray"
        }`}
      >
        {copied ? <Check size={11} /> : <Copy size={11} />}
        <span>{copied ? "Copied" : "Copy Target URL"}</span>
      </button>
    </div>
  );
};

export default ShareButtons;