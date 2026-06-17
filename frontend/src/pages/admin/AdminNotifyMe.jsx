import React, { useState, useEffect } from "react";
import { MessageSquare, CheckCircle2, Smartphone, Clock, Loader2, AlertCircle } from "lucide-react";
import api from "../../utils/api";

const AdminNotifyMe = () => {
  const [successAlert, setSuccessAlert] = useState("");

  // FIXED (Issue 1): Replaced mockup array logs with dynamic server infrastructure listeners
  const [waitlistQueue, setWaitlistQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWaitlistQueue = async () => {
      try {
        // Enforces administrative extraction from folders mapping straight to PRD restock matrices
        const res = await api.get("/notify-me");
        setWaitlistQueue(res.data.waitlist || []);
      } catch (err) {
        console.error("Back-office switchboard notification backlog extraction error:", err);
        setWaitlistQueue([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWaitlistQueue();
  }, []);

  // FIXED (Issue 2): Re-engineered function to coordinate bulk script dispatches with backend layers
  const triggerBulkRestockDispatch = async (productId, productName) => {
    try {
      // Fires broad cast execution trigger out to WhatsApp template providers (WATI API)
      await api.post(`/notify-me/send/${productId}`);
      
      // Updates local layout state array dynamically on successful resolution matching the schema mapping
      setWaitlistQueue((prev) =>
        prev.map((item) =>
          item.product?._id === productId
            ? { ...item, notifiedAt: new Date().toISOString() }
            : item
        )
      );
      
      setSuccessAlert(`Automated WhatsApp notifications broadcasted successfully to all subscribers for "${productName}".`);
      setTimeout(() => setSuccessAlert(""), 4000);
    } catch (err) {
      console.error("Bulk broadcast communication pipeline execution fault:", err);
      setSuccessAlert(err.response?.data?.message || "Failed to trigger bulk alert routing. Verify server tokens.");
      setTimeout(() => setSuccessAlert(""), 3500);
    }
  };

  // FIXED (Issue 1): Themed latency indicator template boundary
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <Loader2 size={36} className="text-primary-gold animate-spin mb-3" />
        <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-gray">
          Extracting Waitlist Restock Queue...
        </p>
      </div>
    );
  }

  // FIXED (Issue 4): Appended clear context fallback views if zero waitlist records exist in database
  if (!loading && waitlistQueue.length === 0) {
    return (
      <div className="min-h-[50vh] border border-dashed border-border-dark rounded-xl p-12 text-center flex flex-col items-center justify-center max-w-5xl mx-auto my-8">
        <AlertCircle size={40} className="text-muted-gray mb-3 animate-pulse" />
        <h3 className="font-heading font-bold uppercase text-pure-white text-sm tracking-wide">Switchboard Empty</h3>
        <p className="text-xs text-muted-gray mt-1 max-w-xs">No active out-of-stock notification backlogs are logged inside the system framework yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      <div className="border-b border-border-dark pb-5">
        <h1 className="text-3xl font-heading font-bold text-primary-gold uppercase tracking-wide">
          Waitlist <span className="text-pure-white">Restock</span> Switchboard
        </h1>
        <p className="text-xs text-muted-gray mt-1">Monitor out-of-stock item interest backlogs and execute bulk WhatsApp restock notification scripts.</p>
      </div>

      {successAlert && (
        <div className={`p-3 text-xs rounded-lg flex items-center gap-2 font-semibold border animate-fade-in ${
          successAlert.toLowerCase().includes("failed") || successAlert.toLowerCase().includes("error")
            ? "bg-error-red/10 border-error-red text-error-red"
            : "bg-success-green/10 border-success-green text-success-green"
        }`}>
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successAlert}</span>
        </div>
      )}

      {/* Main Structural Backlog Switchboard Grid Table */}
      <div className="bg-card-dark border border-border-dark rounded-xl overflow-hidden shadow-md">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-deep-black/40 text-muted-gray font-heading font-bold uppercase tracking-wider border-b border-border-dark text-[10px]">
                <th className="p-4 pl-5">Slug key</th>
                <th className="p-4">Product Target Specification</th>
                <th className="p-4">Rider Contact digits</th>
                <th className="p-4">Log Timestamp</th>
                <th className="p-4">Status Flag</th>
                <th className="p-4 pr-5 text-right">Fulfillment Script</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark/40 font-medium">
              {/* FIXED (Issue 3): Standardized map values parameter properties off genuine schema elements */}
              {waitlistQueue.map((item) => {
                const waitlistId = item._id;
                const productSlug = item.product?.slug || "-";
                const productName = item.product?.name || "Unknown Product Allocation Trace";
                const isNotified = !!item.notifiedAt;
                
                const localizedDate = new Date(item.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                });

                return (
                  <tr key={waitlistId} className="hover:bg-deep-black/20 transition-colors">
                    <td className="p-4 pl-5 font-mono text-primary-gold font-bold text-[11px] tracking-wide select-all">
                      {productSlug}
                    </td>
                    <td className="p-4 text-pure-white font-semibold">
                      {productName}
                    </td>
                    <td className="p-4 space-y-0.5 font-mono text-[11px] text-muted-gray">
                      <div className="flex items-center gap-1.5 text-pure-white/80">
                        <Smartphone size={12} className="text-muted-gray" /> 
                        <a href={`tel:${item.phone}`} className="hover:text-primary-gold transition-colors">+91 {item.phone}</a>
                      </div>
                    </td>
                    <td className="p-4 text-muted-gray font-mono">
                      {localizedDate}
                    </td>
                    <td className="p-4">
                      {/* FIXED (Issue 3): Dynamic badge checks monitoring the notifiedAt database timestamp string */}
                      {!isNotified ? (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-warning-amber/10 border border-warning-amber/20 text-warning-amber font-heading font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md animate-pulse">
                          <Clock size={10} />
                          <span>Awaiting Restock</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-success-green/10 border border-success-green/20 text-success-green font-heading font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md">
                          <CheckCircle2 size={10} />
                          <span>Alert Sent</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-5 text-right shrink-0">
                      {/* FIXED (Issue 3): Wired button handlers contextually down to execute proper unique identifiers metrics */}
                      <button
                        onClick={() => triggerBulkRestockDispatch(item.product?._id, productName)}
                        disabled={isNotified}
                        className="h-8 px-3 bg-deep-black border border-border-dark hover:border-primary-gold text-primary-gold disabled:text-muted-gray disabled:border-border-dark/40 disabled:opacity-20 disabled:cursor-not-allowed text-[10px] font-heading font-bold uppercase tracking-widest rounded-lg transition-all inline-flex items-center gap-1 hover:shadow-gold-glow transform active:scale-95"
                      >
                        <MessageSquare size={11} />
                        <span>Broadcast WhatsApp Alert</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifyMe;