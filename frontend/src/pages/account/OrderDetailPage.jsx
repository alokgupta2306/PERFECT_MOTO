import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClipboardCheck, ArrowLeft, ShieldCheck, MapPin, Package, Calendar, Loader2, ExternalLink } from "lucide-react";
import api from "../../utils/api";

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // FIXED (Issue 1): Replaced mockup data engine with secure state management hooks
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Fetches verified data matching authenticated owner validation states
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error("Order profile trace fetching failure:", err);
        navigate("/account/orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  // FIXED (Issue 4): Unified color map reflecting all 8 core platform status iterations
  const statusColors = {
    placed: "text-info-blue bg-info-blue/10 border-info-blue/20",
    confirmed: "text-warning-amber bg-warning-amber/10 border-warning-amber/20",
    shipped: "text-primary-gold bg-primary-gold/10 border-primary-gold/20",
    out_for_delivery: "text-primary-gold bg-primary-gold/10 border-primary-gold/20",
    delivered: "text-success-green bg-success-green/10 border-success-green/20",
    cancelled: "text-error-red bg-error-red/10 border-error-red/20",
    return_requested: "text-warning-amber bg-warning-amber/10 border-warning-amber/20",
    returned: "text-muted-gray bg-deep-black border-border-dark",
  };

  // FIXED (Issue 1): Appended loading interface layer to manage async render gaps
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-hexagon-pattern">
        <Loader2 size={36} className="text-primary-gold animate-spin mb-3" />
        <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-gray">
          Extracting Allocation Trace...
        </p>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-3xl w-full mx-auto my-8 p-6 bg-card-dark border border-border-dark rounded-xl shadow-lg animate-fade-in hover:shadow-gold-glow transition-all">
      <button 
        onClick={() => navigate("/account/orders")} 
        className="text-xs text-muted-gray hover:text-primary-gold font-heading font-bold uppercase tracking-wider flex items-center gap-1 mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Ledger Log
      </button>

      {/* FIXED (Issue 2): Refactored hardcoded fields to map strictly with Order schema models */}
      <div className="flex flex-col sm:flex-row justify-between border-b border-border-dark pb-4 mb-6 gap-2">
        <div>
          <span className="text-[10px] text-muted-gray uppercase tracking-widest block">Order Audit Core</span>
          <h2 className="text-xl font-mono font-bold text-primary-gold tracking-wide mt-0.5">{order.orderNumber}</h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-gray font-semibold">
          <Calendar size={14} /> 
          <span>
            Placed on: {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Shipping Destination Block */}
        <div className="bg-deep-black/40 border border-border-dark/60 p-4 rounded-xl">
          <h4 className="text-xs font-heading font-bold text-primary-gold uppercase tracking-wider flex items-center gap-1 mb-3">
            <MapPin size={14}/> Shipping Destination
          </h4>
          <p className="text-xs text-pure-white font-bold uppercase tracking-wide">{order.shippingAddress?.fullName}</p>
          <p className="text-xs text-muted-gray mt-1 leading-relaxed">
            {order.shippingAddress?.addressLine1}
            {order.shippingAddress?.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}
          </p>
          <p className="text-xs text-muted-gray font-semibold mt-0.5">
            {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
          </p>
          <p className="text-[11px] text-primary-gold font-mono mt-2.5">Ph: +91 {order.shippingAddress?.phone}</p>
        </div>

        {/* Transit Milestone Block Frame */}
        <div className="bg-deep-black/40 border border-border-dark/60 p-4 rounded-xl flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-heading font-bold text-primary-gold uppercase tracking-wider flex items-center gap-1 mb-3">
              <Package size={14}/> Current Transit Milestone
            </h4>
            
            {/* FIXED (Issue 4): Rendered dynamic status token tags off runtime pipeline matrices */}
            <span className={`text-[10px] border font-heading font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md inline-block ${statusColors[order.orderStatus] || statusColors.placed}`}>
              {order.orderStatus?.replace(/_/g, " ")}
            </span>

            {/* FIXED (Issue 5): Embedded secure conditional external tracking nodes if shipped */}
            {order.trackingNumber && (
              <div className="mt-3 p-2 bg-deep-black/60 border border-border-dark rounded-lg">
                <p className="text-[11px] text-muted-gray font-semibold uppercase tracking-wider">
                  AWB Token: 
                  <a 
                    href={order.trackingUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-primary-gold font-mono ml-1 hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>{order.trackingNumber}</span>
                    <ExternalLink size={10} />
                  </a>
                </p>
              </div>
            )}
          </div>
          
          <p className="text-[11px] text-muted-gray mt-3 leading-relaxed border-t border-border-dark/30 pt-2">
            {order.orderStatus === "placed" && "Your request payload is locked in our validation queue waiting for confirmation logs."}
            {order.orderStatus === "confirmed" && "Fulfillment operators have claimed your build profile. Packaging operations active."}
            {order.orderStatus === "shipped" && "Consignment tracking token generated. Carrier logistics routes have been initialized."}
            {order.orderStatus === "delivered" && "Package successfully dropped at delivery coordinates. Revenue verification confirmed."}
            {order.orderStatus === "cancelled" && "This item sequence allocation trace has been destroyed. Refund pipelines active."}
            {!["placed", "confirmed", "shipped", "delivered", "cancelled"].includes(order.orderStatus) && "Order processing lifecycle status updates are updating natively via automated hooks."}
          </p>
        </div>
      </div>

      {/* Allocation Summary Frame */}
      <div className="border border-border-dark rounded-xl bg-deep-black/20 overflow-hidden mb-6">
        <div className="p-4 border-b border-border-dark bg-card-dark">
          <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-pure-white">Allocation Summary</h4>
        </div>
        <div className="p-4 space-y-4 divider-y divider-border-dark/20">
          {/* FIXED (Issue 3): Standardized map iterations using secure database fallback identifiers */}
          {order.items?.map((item) => {
            const itemKey = item._id || item.product;
            return (
              <div key={itemKey} className="flex justify-between items-center text-xs">
                <div className="min-w-0 flex-1 pr-4">
                  <p className="text-pure-white font-bold uppercase tracking-wide truncate">{item.name}</p>
                  <span className="text-[10px] text-muted-gray font-mono block mt-0.5">Qty: {item.quantity} × ₹{item.price}</span>
                </div>
                <span className="font-mono font-bold text-pure-white shrink-0">₹{item.price * item.quantity}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-border-dark pt-4 font-heading font-bold text-sm text-pure-white">
        <span>Total Settled Cost:</span>
        <span className="font-mono text-lg text-primary-gold">₹{order.totalAmount}</span>
      </div>
    </div>
  );
};

export default OrderDetailPage;