import React from "react";
import { Check } from "lucide-react";

const Timeline = ({ logs }) => {
  return (
    <div className="relative border-l border-border-dark ml-2 pl-6 space-y-6">
      {logs.map((log, index) => (
        <div key={index} className="relative">
          <span className={`absolute -left-[31px] top-0.5 h-4 w-4 rounded-full flex items-center justify-center border text-[8px] font-bold ${
            log.isComplete 
              ? "bg-primary-gold border-primary-gold text-deep-black" 
              : "bg-deep-black border-border-dark text-muted-gray"
          }`}>
            {log.isComplete ? <Check size={10} strokeWidth={3} /> : null}
          </span>
          <div>
            <h4 className={`text-xs font-heading font-bold uppercase tracking-wide ${log.isComplete ? "text-primary-gold" : "text-muted-gray"}`}>
              {log.title}
            </h4>
            <p className="text-[11px] text-muted-gray font-medium mt-0.5">{log.description}</p>
            {log.timestamp && <span className="text-[10px] text-muted-gray/50 font-mono block mt-1">{log.timestamp}</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;