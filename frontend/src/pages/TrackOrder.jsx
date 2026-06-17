import React, { useState } from "react";
import { Search, Truck, AlertCircle, ExternalLink } from "lucide-react";
import api from "../utils/api";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [errorFeedback, setErrorFeedback] = useState("");

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    setErrorFeedback("");
    setTrackingData(null);
    setIsSearching(true);

    if (phone.length < 10) {
      setErrorFeedback("Please enter a valid 10-digit registered mobile number.");
      setIsSearching(false);
      return;
    }

    try {
      const res = await api.get("/orders/track", {
        params: { 
          orderNumber: orderId.trim().toUpperCase(), 
          phone: phone.trim() 
        }
      });
      setTrackingData(res.data.order);
    } catch (err) {
      setErrorFeedback(err.response?.data?.message || "Order not found or mobile verification parameters do not match.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in font-body text-xs text-muted-gray select-none">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-heading font-bold text-pure-white uppercase tracking-wide">
          Guest Tracking <span className="text-primary-gold">Terminal</span>
        </h1>
        <p className="text-xs text-muted-gray mt-1">
          Monitor your order dispatch status instantly without logging in.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ================= LEFT CONTROLS: SUBMISSION ENGINE ================= */}
        <div className="bg-card-dark border border-border-dark rounded-xl p-5 shadow-md uppercase font-heading">
          <h3 className="font-bold tracking-wider text-xs text-pure-white border-b border-border-dark pb-3 mb-4">
            Identity Lookup Verification
          </h3>

          {errorFeedback && (
            <div className="mb-4 p-3 bg-error-red/10 border border-error-red text-error-red text-xs rounded-lg flex items-center gap-2 font-semibold normal-case font-body">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorFeedback}</span>
            </div>
          )}

          <form onSubmit={handleTrackSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold tracking-wider text-muted-gray mb-1">Order Identifier ID</label>
              <input
                type="text"
                required
                placeholder="PM-2024-0001"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full h-11 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono uppercase tracking-widest focus:outline-none focus:border-primary-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-wider text-muted-gray mb-1">Rider Phone digits</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-muted-gray">+91</span>
                <input
                  type="tel"
                  maxLength="10"
                  required
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="w-full h-11 pl-12 pr-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono tracking-wider focus:outline-none focus:border-primary-gold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full h-11 bg-primary-gold hover:bg-gold-hover text-deep-black font-bold uppercase tracking-wider text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-md disabled:opacity-40 mt-2 cursor-pointer border-transparent"
            >
              <Search size={14} />
              <span>{isSearching ? "Extracting Timeline..." : "Locate Consignment"}</span>
            </button>
          </form>
        </div>

        {/* ================= RIGHT CONTROLS: TRANSIT LOG MATRIX ================= */}
        <div className="lg:col-span-2">
          {trackingData ? (
            <div className="bg-card-dark border border-border-dark rounded-xl p-5 shadow-md space-y-6">
              
              {/* Reference Header Status Panel */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-deep-black/60 p-4 border border-border-dark rounded-xl uppercase font-heading">
                <div>
                  <span className="text-[10px] text-muted-gray tracking-widest block">Consignment Tracking Target</span>
                  <h4 className="text-sm font-mono font-bold text-primary-gold tracking-wide mt-0.5 normal-case">{trackingData.orderNumber}</h4>
                </div>
                <div>
                  <span className="text-[10px] text-muted-gray tracking-widest block text-left sm:text-right">Estimated Arrival</span>
                  <p className="text-xs font-bold text-pure-white mt-0.5 text-left sm:text-right tracking-wide">
                    {trackingData.estimatedDelivery || "Within 7 Working Days"}
                  </p>
                </div>
              </div>

              {/* PATCH: Updated parameters display fields to focus on Shiprocket specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold uppercase tracking-wide border-b border-border-dark pb-4 font-heading">
                <div>
                  <span className="text-muted-gray block text-[10px] font-bold tracking-widest">Shiprocket AWB Number</span>
                  <span className="text-pure-white block mt-0.5 font-mono normal-case">
                    {trackingData.awbCode || trackingData.trackingNumber || "Awaiting Carrier Allocation"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-gray block text-[10px] font-bold tracking-widest">Logistic Carrier Portal</span>
                  {trackingData.awbCode || trackingData.trackingNumber ? (
                    <a 
                      href={trackingData.trackingUrl || `https://track.shiprocket.in/${trackingData.awbCode || trackingData.trackingNumber}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary-gold flex items-center gap-1 mt-0.5 hover:underline decoration-primary-gold normal-case font-body font-normal cursor-pointer"
                    >
                      <span>Launch Shiprocket Tracker</span>
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-muted-gray block mt-0.5 normal-case italic font-body font-light">Manifest processing at warehouse</span>
                  )}
                </div>
              </div>

              {/* Core Chronological Visual Pipeline Trace Layer */}
              <div>
                <h4 className="text-xs font-heading font-bold uppercase tracking-widest text-muted-gray mb-4">Atomic Logistics Logs</h4>
                
                {!trackingData.statusHistory || trackingData.statusHistory.length === 0 ? (
                  <p className="text-xs text-muted-gray italic">Your order profile sequence hash has been instantiated. Generating log streams shortly.</p>
                ) : (
                  <div className="relative border-l-2 border-border-dark ml-3 pl-6 space-y-6 font-heading">
                    {trackingData.statusHistory.map((log, index) => (
                      <div key={log._id || index} className="relative group">
                        
                        {/* Interactive Visual Status Node Bullet points */}
                        <span className={`absolute -left-[31px] top-0.5 h-4 w-4 rounded-full flex items-center justify-center border ${
                          index === 0 
                            ? "bg-primary-gold border-primary-gold text-deep-black shadow-gold-glow animate-pulse" 
                            : "bg-deep-black border-muted-gray text-muted-gray"
                        }`}>
                          <div className={`h-1.5 w-1.5 rounded-full ${index === 0 ? "bg-deep-black" : "bg-muted-gray"}`} />
                        </span>

                        <div>
                          <h4 className={`text-xs font-bold uppercase tracking-wide ${index === 0 ? "text-primary-gold" : "text-pure-white"}`}>
                            Status: {log.status}
                          </h4>
                          <div className="flex flex-col gap-y-1 text-[11px] text-muted-gray mt-0.5 normal-case font-body">
                            {log.note && <p className="text-pure-white/70 font-medium">{log.note}</p>}
                            <span className="font-mono text-[10px]">
                              {new Date(log.changedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                            </span>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="border border-dashed border-border-dark p-12 rounded-xl bg-card-dark/20 text-center h-full flex flex-col items-center justify-center min-h-[300px] uppercase font-heading">
              <Truck size={40} className="text-muted-gray mb-3" />
              <h4 className="font-bold tracking-wide text-pure-white">Awaiting Identity Context</h4>
              <p className="text-xs text-muted-gray max-w-xs mx-auto mt-1 normal-case font-body">
                Enter your order ID and mobile number on the left to track your order.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;