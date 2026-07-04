import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Wrench, Calendar, MapPin, AlertCircle, CheckCircle2, LogIn } from "lucide-react";
import useAuth from "../hooks/useAuth";
import api from "../utils/api";

const SERVICE_TYPES = ["General Service", "Repair", "Tyre Change", "Oil Change", "Full Checkup", "Other"];
const TIME_SLOTS = ["9AM - 11AM", "11AM - 1PM", "1PM - 3PM", "3PM - 5PM"];

const ServiceAppointment = () => {
  const { isAuthenticated, user } = useAuth();

  const [bikeBrand, setBikeBrand] = useState("");
  const [bikeModel, setBikeModel] = useState("");
  const [bikeYear, setBikeYear] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [deliveryMode, setDeliveryMode] = useState("drop");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorFeedback, setErrorFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorFeedback("");
    setIsSubmitting(true);

    if (deliveryMode === "pickup" && !address.trim()) {
      setErrorFeedback("Please provide a pickup address.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await api.post("/service-appointments", {
        bikeBrand, bikeModel, bikeYear,
        serviceType, preferredDate, timeSlot,
        deliveryMode, address, notes
      });
      setSuccessData(res.data.appointment);
    } catch (err) {
      setErrorFeedback(err.response?.data?.message || "Could not book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in font-body text-xs text-muted-gray select-none">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-heading font-bold text-pure-white uppercase tracking-wide">
          Motorcycle <span className="text-primary-gold">Service</span>
        </h1>
        <p className="text-xs text-muted-gray mt-1">
          Book a service appointment for your bike — pickup or drop, your choice.
        </p>
      </div>

      {successData ? (
        <div className="bg-card-dark border border-border-dark rounded-xl p-8 text-center max-w-lg mx-auto">
          <CheckCircle2 size={40} className="text-success-green mx-auto mb-3" />
          <h3 className="font-heading font-bold text-pure-white uppercase tracking-wide text-sm">
            Appointment Booked!
          </h3>
          <p className="text-xs text-muted-gray mt-2">
            Your {successData.serviceType} appointment is scheduled for{" "}
            {new Date(successData.preferredDate).toDateString()} ({successData.timeSlot}).
          </p>
          <p className="text-xs text-muted-gray mt-1">
            You'll receive a WhatsApp and email confirmation shortly.
          </p>
        </div>
      ) : !isAuthenticated ? (
        <div className="bg-card-dark border border-border-dark rounded-xl p-8 text-center max-w-lg mx-auto">
          <Wrench size={40} className="text-primary-gold mx-auto mb-3" />
          <h3 className="font-heading font-bold text-pure-white uppercase tracking-wide text-sm">
            Login Required to Book
          </h3>
          <p className="text-xs text-muted-gray mt-2 mb-5">
            You can browse service details freely, but you'll need to login to book an appointment.
          </p>
          <Link
            to="/login"
            state={{ from: "/service" }}
            className="inline-flex items-center gap-1.5 h-11 px-6 bg-primary-gold hover:bg-gold-hover text-deep-black font-bold uppercase tracking-wider text-xs rounded-lg transition-colors"
          >
            <LogIn size={14} />
            <span>Login to Book Appointment</span>
          </Link>
        </div>
      ) : (
        <div className="bg-card-dark border border-border-dark rounded-xl p-5 shadow-md uppercase font-heading max-w-2xl mx-auto">
          <h3 className="font-bold tracking-wider text-xs text-pure-white border-b border-border-dark pb-3 mb-4">
            Book Your Appointment
          </h3>

          {errorFeedback && (
            <div className="mb-4 p-3 bg-error-red/10 border border-error-red text-error-red text-xs rounded-lg flex items-center gap-2 font-semibold normal-case font-body">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorFeedback}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold tracking-wider text-muted-gray mb-1">Bike Brand</label>
                <input
                  type="text"
                  required
                  value={bikeBrand}
                  onChange={(e) => setBikeBrand(e.target.value)}
                  placeholder="e.g. Royal Enfield"
                  className="w-full h-11 px-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs normal-case focus:outline-none focus:border-primary-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold tracking-wider text-muted-gray mb-1">Bike Model</label>
                <input
                  type="text"
                  required
                  value={bikeModel}
                  onChange={(e) => setBikeModel(e.target.value)}
                  placeholder="e.g. Classic 350"
                  className="w-full h-11 px-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs normal-case focus:outline-none focus:border-primary-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold tracking-wider text-muted-gray mb-1">Year</label>
                <input
                  type="number"
                  required
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  value={bikeYear}
                  onChange={(e) => setBikeYear(e.target.value)}
                  placeholder="e.g. 2022"
                  className="w-full h-11 px-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-wider text-muted-gray mb-1">Service Type</label>
              <select
                required
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full h-11 px-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold"
              >
                <option value="">Select Service Type</option>
                {SERVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold tracking-wider text-muted-gray mb-1">Preferred Date</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-gray" />
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full h-11 pl-9 pr-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold tracking-wider text-muted-gray mb-1">Time Slot</label>
                <select
                  required
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full h-11 px-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold"
                >
                  <option value="">Select</option>
                  {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-wider text-muted-gray mb-1">Pickup / Drop</label>
              <div className="flex gap-3">
                {["drop", "pickup"].map(mode => (
                  <button
                    type="button"
                    key={mode}
                    onClick={() => setDeliveryMode(mode)}
                    className={`flex-1 h-11 rounded-lg border text-xs font-bold uppercase tracking-wider transition-colors ${
                      deliveryMode === mode
                        ? "bg-primary-gold text-deep-black border-primary-gold"
                        : "bg-deep-black text-muted-gray border-border-dark hover:text-pure-white"
                    }`}
                  >
                    {mode === "drop" ? "Drop at Center" : "Home Pickup"}
                  </button>
                ))}
              </div>
            </div>

            {deliveryMode === "pickup" && (
              <div>
                <label className="block text-[11px] font-semibold tracking-wider text-muted-gray mb-1">Pickup Address</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-3.5 text-muted-gray" />
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs normal-case focus:outline-none focus:border-primary-gold"
                    placeholder="Full address for pickup"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold tracking-wider text-muted-gray mb-1">Notes (Optional)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs normal-case focus:outline-none focus:border-primary-gold"
                placeholder="Describe the issue, if any"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-primary-gold hover:bg-gold-hover text-deep-black font-bold uppercase tracking-wider text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-md disabled:opacity-40 mt-2"
            >
              <Wrench size={14} />
              <span>{isSubmitting ? "Booking..." : "Book Appointment"}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ServiceAppointment;