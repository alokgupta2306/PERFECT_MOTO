import React from "react";
import { AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SmartRestock = ({ riskNodes = [
  { item: "Steelbird Pro Gloves", sku: "SB-CARB-104", stock: 3, floor: 5 },
  { item: "Vega Crux Helmet Shell", sku: "VM-CRX-091", stock: 1, floor: 8 }
] }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card-dark border border-border-dark rounded-xl p-5 space-y-4 shadow-md w-full">
      <div className="flex justify-between items-center border-b border-border-dark pb-3">
        <h3 className="font-heading font-bold uppercase tracking-wide text-xs text-pure-white flex items-center gap-1.5">
          <AlertTriangle size={14} className="text-warning-amber" />
          <span>Automated Warehouse Restock Boundaries</span>
        </h3>
        <span className="text-[9px] font-mono bg-warning-amber/10 border border-warning-amber/20 text-warning-amber px-2 py-0.5 rounded">
          {riskNodes.length} Depleted Targets
        </span>
      </div>

      <div className="space-y-2.5">
        {riskNodes.length === 0 ? (
          <div className="p-4 bg-deep-black/40 border border-border-dark rounded-xl flex items-center gap-2 text-success-green font-semibold">
            <ShieldCheck size={14} /> <span>Warehouse inventory volumes safely exceed risk boundaries.</span>
          </div>
        ) : (
          riskNodes.map((node, index) => (
            <div key={index} className="p-3 bg-deep-black/60 border border-border-dark rounded-xl flex items-center justify-between text-[11px]">
              <div className="space-y-0.5">
                <span className="text-pure-white font-heading font-bold uppercase tracking-wide block truncate max-w-[180px]">{node.item}</span>
                <span className="text-[9px] font-mono text-muted-gray/60 uppercase tracking-widest block">SKU: {node.sku}</span>
              </div>
              <div className="text-right font-mono text-[10px]">
                <span className="text-error-red font-bold">VOL: {node.stock} units</span>
                <span className="text-muted-gray/40 block">CRITICAL FLOOR: {node.floor}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {riskNodes.length > 0 && (
        <button
          onClick={() => navigate("/admin/products")}
          className="w-full h-8 border border-border-dark hover:border-muted-gray bg-deep-black/40 hover:bg-deep-black text-pure-white text-[10px] font-heading font-bold uppercase tracking-wider rounded-md flex items-center justify-center gap-1 transition-all"
        >
          <span>Open Bulk Procurement Grid</span>
          <ArrowRight size={11} />
        </button>
      )}
    </div>
  );
};

export default SmartRestock;