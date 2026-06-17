import React, { useState, useEffect } from "react";
import { User, Mail, Phone, ShieldCheck, Save } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import api from "../../utils/api";

const MyProfilePage = () => {
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState("");
  const [errorBanner, setErrorBanner] = useState("");

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    bloodGroup: "",
    emergencyContact: ""
  });

  // Load real user data from AuthContext on mount
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bloodGroup: user.bloodGroup || "O+",
        emergencyContact: user.emergencyContact || ""
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorBanner("");
    setSuccessBanner("");

    try {
      await api.put("/auth/me", profileData);
      setSuccessBanner("Rider profile criteria updated securely inside main records.");
      setTimeout(() => setSuccessBanner(""), 4000);
    } catch (err) {
      setErrorBanner(err.response?.data?.message || "Failed to update profile. Please try again.");
      setTimeout(() => setErrorBanner(""), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8 border-b border-border-dark pb-6">
        <h1 className="text-3xl font-heading font-bold text-pure-white uppercase tracking-wide">
          Rider <span className="text-primary-gold">Profile</span> Center
        </h1>
        <p className="text-xs text-muted-gray mt-1">Manage your telemetry credentials, emergency medical records, and default distribution endpoints.</p>
      </div>

      {/* Success Banner */}
      {successBanner && (
        <div className="mb-6 p-3 bg-success-green/10 border border-success-green text-success-green text-xs rounded-lg flex items-center gap-2 font-semibold">
          <ShieldCheck size={16} className="shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Error Banner */}
      {errorBanner && (
        <div className="mb-6 p-3 bg-error-red/10 border border-error-red text-error-red text-xs rounded-lg flex items-center gap-2 font-semibold">
          <span>{errorBanner}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* ================= LEFT: QUICK OVERVIEW CARD ================= */}
        <div className="space-y-6">
          <div className="bg-card-dark border border-border-dark rounded-xl p-5 text-center shadow-md">
            <div className="h-20 w-20 bg-deep-black border-2 border-primary-gold rounded-full flex items-center justify-center mx-auto mb-4 text-primary-gold font-heading text-3xl font-bold uppercase">
              {profileData.name?.charAt(0) || "?"}
            </div>
            <h3 className="text-base font-heading font-bold text-pure-white uppercase tracking-wide">
              {profileData.name || "—"}
            </h3>
            <span className="text-[10px] text-primary-gold font-heading font-extrabold uppercase tracking-widest bg-deep-black border border-border-dark px-2 py-0.5 rounded mt-1 inline-block">
              Pro Rider Tier
            </span>

            <div className="mt-6 border-t border-border-dark pt-4 text-left space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-gray font-semibold">Loyalty Status:</span>
                <span className="text-pure-white font-mono font-bold">
                  {user?.loyaltyPoints || 0} Pts
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-gray font-semibold">Garage Stash:</span>
                <span className="text-pure-white font-mono font-bold">
                  {user?.savedBikes?.length || 0} Bikes Saved
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT: PARAMETRIC DATA INPUTS ================= */}
        <div className="lg:col-span-2 bg-card-dark border border-border-dark rounded-xl p-6 shadow-md">
          <h3 className="font-heading font-bold uppercase tracking-wider text-xs text-pure-white border-b border-border-dark pb-3 mb-6">
            Account Metadata Coordinates
          </h3>

          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-gray" size={16} />
                  <input
                    type="text"
                    name="name"
                    required
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="w-full h-10 pl-10 pr-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-sm focus:outline-none focus:border-primary-gold transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-gray/40" size={16} />
                  <input
                    type="email"
                    disabled
                    value={profileData.email}
                    className="w-full h-10 pl-10 pr-4 bg-deep-black/40 text-muted-gray border border-border-dark rounded-lg text-sm cursor-not-allowed opacity-60 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-gray" size={16} />
                  <input
                    type="tel"
                    name="phone"
                    required
                    maxLength="10"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="w-full h-10 pl-10 pr-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-sm font-mono tracking-wide focus:outline-none focus:border-primary-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Blood Group (Critical Medical Flag)</label>
                <select
                  name="bloodGroup"
                  value={profileData.bloodGroup}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-sm focus:outline-none focus:border-primary-gold cursor-pointer font-semibold uppercase"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Emergency SOS Phone Target</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-error-red/60" size={16} />
                <input
                  type="tel"
                  name="emergencyContact"
                  maxLength="10"
                  value={profileData.emergencyContact}
                  onChange={handleInputChange}
                  className="w-full h-10 pl-10 pr-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-sm font-mono tracking-wide focus:outline-none focus:border-primary-gold"
                  placeholder="In case of on-trail incident"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-border-dark/60 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-11 px-6 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase tracking-wider text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-md disabled:opacity-40"
              >
                <Save size={14} />
                <span>{isSubmitting ? "Committing Updates..." : "Save Parameters"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;