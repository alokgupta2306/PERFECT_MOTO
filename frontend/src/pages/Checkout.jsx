// frontend/src/pages/Checkout.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ShieldCheck, CreditCard, ShoppingBag, ArrowRight, CheckCircle2, Loader2, Plus, X, Trash2 } from "lucide-react";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import api from "../utils/api";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Controlled UI Selection States
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod] = useState("shiprocket");
  const [isProcessing, setIsProcessing] = useState(false);

  // New Address Inline Form States
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(""); // Track address being removed
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false
  });

  // Pull addresses dynamically from the user object state profile
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      setAddresses(user.addresses);
      const defaultAddr = user.addresses.find((a) => a.isDefault);
      setSelectedAddress(defaultAddr ? defaultAddr._id : user.addresses[0]._id);
    }
  }, [user]);

  // Compute financial ledger sums safely
  const subtotalPrice = cartItems.reduce((acc, item) => {
    const productNode = item.product || {};
    const priceVector = Number(productNode.salePrice || productNode.price || 0);
    return acc + (priceVector * item.quantity);
  }, 0);
  
  const totalTax = 0; 
  const deliveryFee = subtotalPrice > 999 || subtotalPrice === 0 ? 0 : 50;
  const grandTotal = subtotalPrice + totalTax + deliveryFee;

  // Handle saving new inline address and instantly select it
  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    setIsSavingAddress(true);

    if (newAddress.phone.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      setIsSavingAddress(false);
      return;
    }

    try {
      const res = await api.post("/auth/addresses", newAddress);
      if (res.data.success && res.data.addresses) {
        const updatedAddresses = res.data.addresses;
        setAddresses(updatedAddresses);
        
        // Locate the latest appended address to select it instantly
        const newlyCreated = updatedAddresses[updatedAddresses.length - 1];
        if (newlyCreated) {
          setSelectedAddress(newlyCreated._id);
        }

        // Reset form variables state map
        setNewAddress({
          fullName: "",
          phone: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          pincode: "",
          isDefault: false
        });
        setShowAddressForm(false);

        // Smooth scroll view directly to the verified checkout button parameters block
        setTimeout(() => {
          document.getElementById("secure-payment-hub")?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to commit your shipping destination profile.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  // Handle address item deletion straight off the card interface
  const handleDeleteAddress = async (e, id) => {
    e.stopPropagation(); // Avoid triggering card selection click handlers below it
    if (!window.confirm("Are you sure you want to permanently erase this shipping destination?")) return;

    setIsDeletingId(id);
    try {
      const res = await api.delete(`/auth/addresses/${id}`);
      if (res.data.success && res.data.addresses) {
        const remainingAddresses = res.data.addresses;
        setAddresses(remainingAddresses);

        // Auto-select fallback address if current selected item was just dropped
        if (selectedAddress === id) {
          if (remainingAddresses.length > 0) {
            const fallback = remainingAddresses.find(a => a.isDefault) || remainingAddresses[0];
            setSelectedAddress(fallback._id);
          } else {
            setSelectedAddress("");
          }
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to drop address context node registry.");
    } finally {
      setIsDeletingId("");
    }
  };

  // Complete Live API Post Order Sequence + Shiprocket Redirection Link Workflow
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!selectedAddress) {
      alert("Please add or select a target shipping destination profile before checkout.");
      return;
    }

    setIsProcessing(true);
    const chosenAddress = addresses.find((a) => a._id === selectedAddress);

    try {
      const orderPayload = {
        items: cartItems.map((item) => {
          const productNode = item.product || {};
          return {
            product: productNode._id,
            name: productNode.name || "Accessory Component Unit",
            image: productNode.images?.[0]?.url || productNode.images?.[0] || "",
            price: Number(productNode.salePrice || productNode.price || 0),
            quantity: item.quantity,
          };
        }),
        shippingAddress: {
          fullName: chosenAddress.fullName,
          phone: chosenAddress.phone,
          addressLine1: chosenAddress.addressLine1,
          addressLine2: chosenAddress.addressLine2 || "",
          city: chosenAddress.city,
          state: chosenAddress.state,
          pincode: chosenAddress.pincode,
        },
        paymentMethod,
      };

      const res = await api.post("/orders", orderPayload);
      const orderId = res.data.order._id;

      const paymentRes = await api.post("/payment/create-order", {
        orderId: orderId,
      });

      if (paymentRes.data.success && paymentRes.data.paymentLink) {
        clearCart();
        window.location.href = paymentRes.data.paymentLink;
      } else {
        throw new Error("Logistics gateway did not return an active authorization payment link.");
      }
      
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Order engine checkout trace failure loop tripped.");
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-hexagon-pattern">
        <div className="p-4 bg-card-dark/50 rounded-full text-primary-gold mb-4 border border-border-dark">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-2xl font-heading font-bold uppercase text-pure-white">Checkout Terminal Secure</h2>
        <p className="text-xs text-muted-gray mt-2 max-w-xs mx-auto">No items found in your queue. Please load parts into your cart to initialize checkout operations.</p>
        <button onClick={() => navigate("/shop")} className="h-11 px-6 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase tracking-wider rounded-lg mt-6 transition-colors shadow-md border-transparent cursor-pointer">Return to Shop</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in text-xs font-body text-muted-gray select-none">
      <h1 className="text-3xl font-heading font-bold text-pure-white uppercase tracking-wide mb-8">
        Secure <span className="text-primary-gold">Checkout</span> Gateway
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* ================= LEFT SIDE: OPERATIONS PANELS ================= */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section A: Shipping Logistics Target Option Set */}
          <div className="bg-card-dark border border-border-dark rounded-xl p-5 shadow-md border-solid">
            <div className="flex items-center justify-between mb-4 border-b border-border-dark pb-3">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-primary-gold" />
                <h3 className="font-heading font-bold uppercase tracking-wider text-sm text-pure-white">1. Deliver To Address</h3>
              </div>
              {addresses.length > 0 && !showAddressForm && (
                <button
                  type="button"
                  onClick={() => setShowAddressForm(true)}
                  className="px-3 h-8 bg-primary-gold/10 hover:bg-primary-gold/20 text-primary-gold border border-primary-gold/30 rounded-lg font-heading font-bold uppercase text-[10px] tracking-wider flex items-center gap-1 transition-all cursor-pointer border-solid"
                >
                  <Plus size={12} /> Add New
                </button>
              )}
            </div>

            {/* Inline Address Form */}
            {showAddressForm || addresses.length === 0 ? (
              <form onSubmit={handleSaveNewAddress} className="bg-deep-black/40 border border-border-dark p-4 rounded-xl mb-4 space-y-4 animate-fade-in border-solid">
                <div className="flex justify-between items-center border-b border-border-dark pb-2">
                  <h4 className="font-heading font-bold text-pure-white uppercase tracking-wide text-[11px]">Create Shipping Destination Profile</h4>
                  {addresses.length > 0 && (
                    <X 
                      size={16} 
                      className="text-muted-gray hover:text-error-red cursor-pointer transition-colors" 
                      onClick={() => setShowAddressForm(false)}
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold tracking-wider text-muted-gray mb-1">Rider Full Name</label>
                    <input
                      type="text"
                      required
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                      placeholder="e.g. Alok Sharma"
                      className="w-full h-10 px-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-semibold focus:outline-none focus:border-primary-gold border-solid"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold tracking-wider text-muted-gray mb-1">10-Digit Mobile Number</label>
                    <input
                      type="tel"
                      required
                      maxLength="10"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value.replace(/\D/g, "") })}
                      placeholder="9876543210"
                      className="w-full h-10 px-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono tracking-wide focus:outline-none focus:border-primary-gold border-solid"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-semibold tracking-wider text-muted-gray mb-1">Flat / House No. / Building / Street Address</label>
                  <input
                    type="text"
                    required
                    value={newAddress.addressLine1}
                    onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                    placeholder="Address Line 1"
                    className="w-full h-10 px-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold border-solid"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-semibold tracking-wider text-muted-gray mb-1">Locality / Colony / Sector / Landmark (Optional)</label>
                  <input
                    type="text"
                    value={newAddress.addressLine2}
                    onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                    placeholder="Address Line 2"
                    className="w-full h-10 px-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold border-solid"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold tracking-wider text-muted-gray mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      placeholder="Mumbai"
                      className="w-full h-10 px-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold border-solid"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold tracking-wider text-muted-gray mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      placeholder="Maharashtra"
                      className="w-full h-10 px-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold border-solid"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold tracking-wider text-muted-gray mb-1">Pincode</label>
                    <input
                      type="text"
                      required
                      maxLength="6"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value.replace(/\D/g, "") })}
                      placeholder="400001"
                      className="w-full h-10 px-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono tracking-widest focus:outline-none focus:border-primary-gold border-solid"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="h-9 px-4 bg-transparent border border-border-dark hover:border-muted-gray text-pure-white uppercase font-heading font-bold text-[10px] tracking-wider rounded-lg transition-colors cursor-pointer border-solid"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSavingAddress}
                    className="h-9 px-5 bg-primary-gold hover:bg-gold-hover text-deep-black uppercase font-heading font-bold text-[10px] tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-md disabled:opacity-40 cursor-pointer border-transparent"
                  >
                    {isSavingAddress ? <Loader2 size={12} className="animate-spin" /> : null}
                    <span>Save and Select Destination</span>
                  </button>
                </div>
              </form>
            ) : null}

            {/* Render Saved Cards */}
            {addresses.length > 0 && !showAddressForm ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                {addresses.map((addr) => (
                  <div 
                    key={addr._id}
                    onClick={() => !isProcessing && setSelectedAddress(addr._id)}
                    className={`border rounded-xl p-4 cursor-pointer transition-all relative border-solid group ${
                      selectedAddress === addr._id 
                        ? "bg-deep-black border-primary-gold shadow-gold-glow" 
                        : "bg-deep-black/40 border-border-dark hover:border-muted-gray"
                    } ${isProcessing || isDeletingId === addr._id ? "pointer-events-none opacity-60" : ""}`}
                  >
                    {selectedAddress === addr._id && (
                      <CheckCircle2 size={16} className="absolute top-3 right-3 text-primary-gold" />
                    )}

                    {/* 🔥 NEW FEATURE: Delete address action button positioned smoothly inside card frame */}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteAddress(e, addr._id)}
                      disabled={isProcessing}
                      className="absolute bottom-4 right-4 p-2 bg-card-dark text-muted-gray hover:text-error-red border border-border-dark rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer border-solid flex items-center justify-center shadow-sm"
                      title="Delete Shipping Address"
                    >
                      {isDeletingId === addr._id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Trash2 size={13} />
                      )}
                    </button>

                    <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-card-dark text-primary-gold border border-border-dark border-solid">
                      {addr.isDefault ? "Primary Address" : "Destination Unit"}
                    </span>
                    <h4 className="text-xs font-bold text-pure-white mt-3 uppercase tracking-wide pr-6">{addr.fullName}</h4>
                    <p className="text-xs text-muted-gray mt-1 leading-relaxed pr-6">{addr.addressLine1}</p>
                    {addr.addressLine2 && <p className="text-xs text-muted-gray leading-relaxed pr-6">{addr.addressLine2}</p>}
                    <p className="text-xs text-muted-gray font-semibold mt-0.5">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-[11px] text-primary-gold font-mono mt-2 mb-1">Mobile: +91 {addr.phone}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Section B: Secured Payment Hub Parameters */}
          <div id="secure-payment-hub" className="bg-card-dark border border-border-dark rounded-xl p-5 shadow-md border-solid">
            <div className="flex items-center gap-2 mb-4 border-b border-border-dark pb-3">
              <CreditCard size={18} className="text-primary-gold" />
              <h3 className="font-heading font-bold uppercase tracking-wider text-sm text-pure-white">2. Secure Transaction Endpoint</h3>
            </div>

            <div className="space-y-3">
              <div className="border rounded-xl p-4 bg-deep-black border-primary-gold shadow-gold-glow select-none border-solid">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full border border-primary-gold flex items-center justify-center border-solid">
                      <div className="h-2 w-2 rounded-full bg-primary-gold" />
                    </div>
                    <div>
                      <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-pure-white">Shiprocket Prepaid Checkout</h4>
                      <p className="text-[11px] text-muted-gray mt-0.5">Secure processing supporting Credit/Debit Cards, UPI systems, NetBanking, and Wallets</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-success-green font-bold tracking-widest uppercase border border-success-green/20 bg-success-green/5 px-2 py-0.5 rounded hidden sm:inline border-solid">Instant Verification</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ================= RIGHT SIDE: FINANCIAL SUMMARY ================= */}
        <div>
          <div className="bg-card-dark border border-border-dark rounded-xl p-5 shadow-md sticky top-24 border-solid">
            <h3 className="font-heading font-bold uppercase tracking-wider text-sm text-pure-white border-b border-border-dark pb-3 mb-4">
              Final Checklist
            </h3>

            <div className="max-h-40 overflow-y-auto space-y-3 pr-1 border-b border-border-dark pb-4 mb-4 scrollbar-thin">
              {cartItems.map((item) => {
                const productNode = item.product || {};
                const itemId = productNode._id;
                const itemName = productNode.name || "Accessory Component Unit";
                const itemPrice = Number(productNode.salePrice || productNode.price || 0);

                if (!itemId) return null;

                return (
                  <div key={itemId} className="flex justify-between items-center text-xs">
                    <div className="min-w-0 flex-1 pr-2">
                      <h4 className="text-pure-white font-bold uppercase tracking-wide truncate">{itemName}</h4>
                      <span className="text-[10px] text-muted-gray font-mono block mt-0.5">Qty: {item.quantity} × ₹{itemPrice.toLocaleString("en-IN")}</span>
                    </div>
                    <span className="font-mono text-pure-white font-bold shrink-0">₹{(itemPrice * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2.5 border-b border-border-dark pb-4 text-xs font-semibold uppercase tracking-wide">
              <div className="flex justify-between">
                <span className="text-muted-gray">Subtotal</span>
                <span className="font-mono text-pure-white">₹{subtotalPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-gray">Shipping Logistics</span>
                <span className="font-mono text-pure-white">
                  {deliveryFee === 0 ? <span className="text-success-green">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center my-4">
              <span className="font-heading font-bold uppercase tracking-wider text-sm text-pure-white">Total Charge</span>
              <span className="font-mono text-xl font-bold text-primary-gold">₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full h-12 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all shadow-md mt-6 disabled:opacity-50 transform hover:scale-[1.01] cursor-pointer border-transparent"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Redirecting to Shiprocket Hub...</span>
                </div>
              ) : (
                <>
                  <span>Pay Online via Shiprocket</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-gray uppercase tracking-wider font-semibold text-center mt-4 border-t border-border-dark pt-3 border-solid">
              <ShieldCheck size={14} className="text-success-green" />
              <span>Unified Shiprocket API Security Encryption Protocol</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;