import React, { useState } from "react";
import { Bold, Italic, List, Code } from "lucide-react";

const RichTextEditor = ({ value = "", onChange, label = "Technical Specifications Overview" }) => {
  const [text, setText] = useState(value);

  const handleTextValueUpdate = (val) => {
    setText(val);
    if (onChange) onChange(val);
  };

  return (
    <div className="space-y-1.5 w-full">
      <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray">{label}</label>
      <div className="border border-border-dark rounded-xl bg-deep-black overflow-hidden focus-within:border-primary-gold transition-colors">
        
        {/* Style formatting toolbar switches */}
        <div className="flex items-center gap-1 p-2 bg-card-dark/40 border-b border-border-dark text-muted-gray shrink-0">
          <button type="button" className="p-1 hover:text-pure-white hover:bg-deep-black rounded"><Bold size={13} /></button>
          <button type="button" className="p-1 hover:text-pure-white hover:bg-deep-black rounded"><Italic size={13} /></button>
          <span className="h-4 w-px bg-border-dark mx-1" />
          <button type="button" className="p-1 hover:text-pure-white hover:bg-deep-black rounded"><List size={13} /></button>
          <button type="button" className="p-1 hover:text-pure-white hover:bg-deep-black rounded"><Code size={13} /></button>
        </div>

        <textarea
          value={text}
          onChange={(e) => handleTextValueUpdate(e.target.value)}
          rows={4}
          className="w-full bg-transparent p-4 text-xs font-mono text-pure-white placeholder:text-muted-gray/40 focus:outline-none resize-none custom-scrollbar"
          placeholder="### Engineering Properties Matrix Parameters
- ISI Safety Threshold Verified
-  multi-point configuration chassis alignment..."
        />
      </div>
    </div>
  );
};

export default RichTextEditor;