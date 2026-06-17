import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { CheckCircle, Package, ArrowRight, ClipboardCheck, AlertTriangle, Loader2, Truck } from "lucide-react";
import api from "../utils/api";

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract state parameters injected by the checkout submission process
  const orderDetails = location.state;

  // Controlled Data Fetching States
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Safeguard combined with live API order data population
  useEffect(() => {
    if (!orderDetails?.orderId) {
      const timeout = setTimeout(() => {
        navigate("/", { replace: true });
      }, 5000);
      return () => clearTimeout(timeout);
    }

    const fetchOrderData = async () => {
      try {
        // Safe authenticated collection fetch targeting your specific order reference ID routing
        const res = await api.get(`/orders/${orderDetails.orderId}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error("Order verification engine failed:", err);
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderDetails, navigate]);

  // Loading state indicator context frame
  if (orderDetails && loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-hexagon-pattern animate-fade-in">
        <Loader2 size={40} className="text-primary-gold animate-spin mb-4" />
        <h3 className="text-lg font-heading font-bold uppercase text-pure-white tracking-wider">
          Verifying Transaction Integrity...
        </h3>
        <p className="text-xs text-muted-gray mt-1 max-w-xs mx-auto">
          Synchronizing payment receipts and provisioning premium logistics assets.
        </p>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-hexagon-pattern animate-fade-in">
        <div className="p-4 bg-card-dark/50 rounded-full text-warning-amber mb-4 border border-border-dark animate-bounce">
          <AlertTriangle size={40} />
        </div>
        <h2 className="text-2xl font-heading font-bold uppercase text-pure-white tracking-wide">No Active Session Found</h2>
        <p className="text-xs text-muted-gray mt-2 max-w-xs mx-auto">
          You are seeing this because you tried to access the confirmation screen directly without an active transaction. Redirecting to storefront...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl w-full mx-auto my-12 p-8 bg-card-dark border border-border-dark rounded-xl shadow-gold-glow text-center animate-fade-in">
      
      {/* Dynamic Animated Success Badge */}
      <div className="mx-auto h-20 w-20 bg-success-green/10 border border-success-green/30 text-success-green rounded-full flex items-center justify-center mb-6 shadow-md">
        <CheckCircle size={44} className="animate-pulse" />
      </div>

      <h1 className="text-3xl font-heading font-bold text-pure-white uppercase tracking-wide">
        Order Placed <span className="text-primary-gold">Successfully!</span>
      </h1>
      <p className="text-xs text-muted-gray mt-1">Your premium gear allocations have been secured and locked for processing.</p>

      {/* PATCH: 7-Day Express Shipping & Full Refund Money-Back Guarantee Layout Box Block */}
      <div className="my-6 border-2 border-dashed border-primary-gold/40 bg-primary-gold/5 p-5 rounded-xl text-left space-y-2 animate-fade-in uppercase font-heading">
        <div className="flex items-center gap-2.5 text-primary-gold font-bold text-sm tracking-wider">
          <Truck size={20} className="animate-bounce shrink-0" />
          <span>7-Day Delivery Guarantee Promised</span>
        </div>
        <p className="text-xs text-light-gray font-medium tracking-wide leading-relaxed normal-case font-body">
          Your order will be delivered within 7 working days. If your order is not delivered within 7 days, you are eligible for a full refund. Contact us on WhatsApp or email and we will process your refund within 3-5 business days.
        </p>
      </div>

      {/* Transaction Reference Card details mapped to Mongoose schema outputs */}
      <div className="my-6 bg-deep-black border border-border-dark rounded-xl p-5 text-left space-y-4">
        
        <div className="flex justify-between items-center border-b border-border-dark pb-3">
          <div className="flex items-center gap-2 text-muted-gray">
            <ClipboardCheck size={16} className="text-primary-gold" />
            <span className="text-xs font-heading font-semibold uppercase tracking-wider">Booking Reference:</span>
          </div>
          <span className="font-mono text-sm font-extrabold text-primary-gold tracking-wider">
            {order?.orderNumber}
          </span>
        </div>

        <div className="flex justify-between items-center border-b border-border-dark pb-3">
          <div className="flex items-center gap-2 text-muted-gray">
            <Package size={16} className="text-primary-gold" />
            <span className="text-xs font-heading font-semibold uppercase tracking-wider">Settlement Amount:</span>
          </div>
          <span className="font-mono text-sm font-bold text-pure-white">₹{order?.totalAmount?.toLocaleString("en-IN")}</span>
        </div>

        <div>
          <span className="text-pure-white font-heading font-bold text-xs tracking-wider block mb-1">
            LOGISTICS DESTINATION TARGET
          </span>
          <p className="text-xs text-light-gray font-semibold uppercase tracking-wide">
            {order?.shippingAddress?.fullName}
          </p>
          <p className="text-xs text-muted-gray mt-0.5 leading-relaxed">
            {order?.shippingAddress?.addressLine1}
            {order?.shippingAddress?.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""},{" "}
            {order?.shippingAddress?.city}, {order?.shippingAddress?.state} - {order?.shippingAddress?.pincode}
          </p>
        </div>

      </div>

      <div className="p-4 bg-card-dark border border-border-dark rounded-lg text-left mb-8 uppercase font-heading">
        <h4 className="text-xs font-bold text-primary-gold tracking-wider flex items-center gap-1.5">
          <span>⚡ Live Order Update Notification</span>
        </h4>
        <p className="text-[11px] text-muted-gray mt-1 leading-relaxed normal-case font-body">
          An automated transactional invoice breakdown and automated confirmation route tracking token has been transmitted to your mobile (+91 {order?.shippingAddress?.phone}) via WhatsApp notifications.
        </p>
      </div>

      {/* Navigation Redirect Utilities */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link 
          to="/shop" 
          className="w-full sm:w-auto h-11 px-6 bg-deep-black border border-border-dark text-pure-white hover:text-primary-gold hover:border-primary-gold font-heading font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all text-xs decoration-transparent"
        >
          <span>Continue Browsing</span>
        </Link>
        <Link 
          to={`/track?orderNumber=${order?.orderNumber}&phone=${order?.shippingAddress?.phone}`} 
          className="w-full sm:w-auto h-11 px-6 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all text-xs shadow-md decoration-transparent border-transparent"
        >
          <span>Track Order Status</span>
          <ArrowRight size={14} />
        </Link>
      </div>

    </div>
  );
};

export default OrderConfirmationPage;