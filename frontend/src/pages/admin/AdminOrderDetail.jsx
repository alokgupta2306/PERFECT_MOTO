import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, CheckCircle2, Loader2, Truck, FileText, User } from "lucide-react";
import api from "../../utils/api";

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Initializing state vectors to align explicitly with the live transaction schemas
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successBanner, setSuccessBanner] = useState("");

  // Controlled Form Inputs for Database Status Updates
  const [selectedStatus, setSelectedStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [awbCode, setAwbCode] = useState(""); // PATCH: Integrated active Air Waybill state layer variable
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchAdminOrderDetails = async () => {
      try {
        // Enforces full administrative document data population (Section 19, Admin API Routes)
        const res = await api.get(`/orders/${id}`);
        const o = res.data.order;
        
        setOrder(o);
        setSelectedStatus(o.orderStatus);
        setTrackingNumber(o.trackingNumber || "");
        setTrackingUrl(o.trackingUrl || "");
        setAwbCode(o.awbCode || ""); // PATCH: Hydrate AWB reference from live record properties
        setNotes(o.notes || "");
      } catch (err) {
        console.error("Back-office transaction auditing entry extraction error:", err);
        navigate("/admin/orders");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminOrderDetails();
  }, [id, navigate]);

  // Replaced placeholder manual setups with active asynchronous PUT workflow loops
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessBanner("");

    try {
      // PATCH: Explicitly dispatch tracking updates + awbCode straight through to your status modifier route 
      await api.put(`/orders/${id}/status`, {
        orderStatus: selectedStatus,
        trackingNumber,
        trackingUrl,
        awbCode, // Handles dynamic background email template variable injections
        notes
      });

      setSuccessBanner(`Operational parameter adjustments saved for reference: ${order?.orderNumber}`);
      setTimeout(() => setSuccessBanner(""), 3500);
    } catch (err) {
      console.error("Fulfillment adjustment modification override error:", err);
      alert(err.response?.data?.message || "Override rules rejected by database integrity filters.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-hexagon-pattern font-body text-xs text-muted-gray">
        <Loader2 size={36} className="text-primary-gold animate-spin mb-3" />
        <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-gray">
          Extracting System Transaction Audit Node...
        </p>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8 animate-fade-in font-body text-xs text-muted-gray select-none">
      <div className="flex items-center justify-between border-b border-border-dark pb-4">
        <button
          type="button"
          onClick={() => navigate("/admin/orders")}
          className="text-xs text-muted-gray hover:text-primary-gold font-heading font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Transactions Registry</span>
        </button>
      </div>

      {successBanner && (
        <div className="p-3 bg-success-green/10 border border-success-green text-success-green text-xs rounded-lg flex items-center gap-2 font-semibold animate-fade-in normal-case font-body">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      <div className="bg-card-dark border border-border-dark rounded-xl p-6 shadow-md hover:shadow-gold-glow transition-all">
        <h3 className="font-heading font-bold uppercase tracking-wider text-sm text-pure-white border-b border-border-dark pb-3 mb-6 flex items-center gap-2">
          <FileText size={16} className="text-primary-gold" />
          <span>Order Audit Override Terminal</span>
        </h3>

        <form onSubmit={handleSaveChanges} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-deep-black/30 p-4 rounded-xl border border-border-dark/40 font-heading text-xs uppercase">
            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] text-muted-gray uppercase tracking-widest block font-bold">Metadata Record Target</span>
              <p className="text-sm font-mono font-bold text-primary-gold tracking-wide select-all normal-case">{order.orderNumber}</p>
              <p className="text-muted-gray font-medium tracking-wide">
                Placed: {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}{" "}
                {new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </p>
              <div className="pt-2 border-t border-border-dark/20 text-pure-white font-heading tracking-wide">
                <p className="font-bold flex items-center gap-1"><User size={12} className="text-muted-gray" /> {order.user?.name || "Guest Rider"}</p>
                <p className="text-muted-gray font-mono mt-0.5 normal-case tracking-normal">{order.user?.email || "customer-email-unbound"}</p>
                <p className="text-primary-gold font-mono font-bold text-sm mt-1.5 tracking-wide">Settlement Total: ₹{order.totalAmount?.toLocaleString("en-IN") || 0}</p>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Fulfillment Pipeline Milestone</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full h-10 px-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-heading font-bold uppercase tracking-wider focus:outline-none focus:border-primary-gold cursor-pointer transition-colors text-primary-gold border-solid"
              >
                <option value="placed">Placed (Order Initialized Log)</option>
                <option value="confirmed">Confirmed (Operators Claimed Profile)</option>
                <option value="shipped">Shipped (Carrier Logistics Assigned)</option>
                <option value="out_for_delivery">Out For Delivery (Local Courier Depot)</option>
                <option value="delivered">Delivered (Fulfillment Settlement Complete)</option>
                <option value="cancelled">Cancelled (Void Allocation Node Trace)</option>
                <option value="return_requested">Return Requested (7-Day Evaluation)</option>
                <option value="returned">Returned (Restock Inventory Restored)</option>
              </select>
            </div>
          </div>

          {/* Secure Picking Checklist Layout */}
          {order.items && order.items.length > 0 && (
            <div className="space-y-2 uppercase font-heading">
              <label className="block text-[11px] font-semibold tracking-wider text-muted-gray">Secure Manifest Picking Checklist</label>
              <div className="bg-deep-black rounded-lg border border-border-dark divide-y divide-border-dark/40 overflow-hidden border-solid">
                {order.items.map((item, index) => (
                  <div key={item._id || item.product || index} className="flex justify-between items-center p-3 text-xs hover:bg-card-dark/30 transition-colors">
                    <div className="min-w-0 flex-1 pr-4">
                      <span className="text-pure-white font-bold block tracking-wide truncate">{item.name}</span>
                      <span className="text-[10px] text-muted-gray block font-mono mt-0.5 normal-case tracking-normal">Reference Hash ID: {item.product}</span>
                    </div>
                    <span className="text-primary-gold font-mono font-bold bg-deep-black border border-border-dark px-2 py-1 rounded shrink-0 border-solid">
                      x{item.quantity} × ₹{item.price?.toLocaleString("en-IN") || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PATCH: Quad-split grid form wrapping live Shiprocket AWB logistics telemetry inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border-dark/30 pt-4 uppercase font-heading">
            <div>
              <label className="block text-[11px] font-semibold tracking-wider text-muted-gray mb-1.5 flex items-center gap-1">
                <Truck size={12} className="text-primary-gold" />
                <span>Shiprocket AWB Code</span>
              </label>
              <input
                type="text"
                value={awbCode}
                onChange={(e) => setAwbCode(e.target.value)}
                placeholder="e.g. SR835696878"
                className="w-full h-10 px-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono tracking-wide focus:outline-none focus:border-primary-gold transition-colors border-solid"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-wider text-muted-gray mb-1.5">Alternative Tracking Number</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. DTDC1234567"
                className="w-full h-10 px-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono tracking-wide focus:outline-none focus:border-primary-gold transition-colors border-solid"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-wider text-muted-gray mb-1.5">Logistics External URL Link</label>
              <input
                type="url"
                value={trackingUrl}
                onChange={(e) => setTrackingUrl(e.target.value)}
                placeholder="https://track.shiprocket.in/..."
                className="w-full h-10 px-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold transition-colors border-solid"
              />
            </div>
          </div>

          <div className="uppercase font-heading">
            <label className="block text-[11px] font-semibold tracking-wider text-muted-gray mb-1.5">Internal Operations Log Notes</label>
            <textarea
              rows="4"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-medium focus:outline-none focus:border-primary-gold resize-none leading-relaxed transition-colors font-body normal-case border-solid"
              placeholder="Add internal shipping notes, courier tracking updates, or custom warehouse instructions..."
            />
          </div>

          <div className="pt-3 border-t border-border-dark/60 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="h-11 px-6 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase tracking-wider text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-md disabled:opacity-40 transform active:scale-95 cursor-pointer border-transparent"
            >
              <Save size={14} />
              <span>{isSaving ? "Saving Order Updates..." : "Commit Override Rules"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminOrderDetail;