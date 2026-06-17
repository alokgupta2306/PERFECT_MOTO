import React from "react";
import { BarChart3, Info } from "lucide-react";

const ChartWidget = ({ metrics = [
  { axis: "M", metric: 64000 },
  { axis: "T", metric: 82000 },
  { axis: "W", metric: 41000 },
  { axis: "T", metric: 95000 },
  { axis: "F", metric: 120000 }
] }) => {
  const maximumBound = Math.max(...metrics.map(m => m.metric));

  return (
    <div className="bg-card-dark border border-border-dark p-5 rounded-xl space-y-4 shadow-md w-full">
      <div className="flex justify-between items-center border-b border-border-dark pb-3">
        <h3 className="font-heading font-bold uppercase tracking-wide text-xs text-pure-white flex items-center gap-1.5">
          <BarChart3 size={14} className="text-primary-gold" />
          <span>Fulfillment Velocity Telemetry Logs</span>
        </h3>
        <Info size={13} className="text-muted-gray" />
      </div>

      <div className="flex justify-between items-end h-32 px-4 font-mono text-[10px] text-muted-gray">
        {metrics.map((node, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-1 group relative">
            <span className="absolute -top-6 text-[9px] text-primary-gold bg-deep-black border border-border-dark rounded px-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              ₹{(node.metric / 1000).toFixed(0)}k
            </span>
            <div 
              className="w-8 rounded-t bg-primary-gold/10 border-t border-l border-r border-primary-gold/30 group-hover:bg-primary-gold/30 group-hover:border-primary-gold transition-all"
              style={{ height: `${(node.metric / maximumBound) * 100}%`, minHeight: '8px' }}
            />
            <span className="text-[9px] font-heading font-bold text-muted-gray/60 mt-1 uppercase">{node.axis}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartWidget;