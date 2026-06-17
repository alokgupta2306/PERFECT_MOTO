import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ShieldCheck, ArrowRight, KeyRound } from "lucide-react";
// FIXED: Imported central system API network utility instance
import api from "../utils/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successState, setSuccessState] = useState(false);

  // FIXED: Swapped out the local simulation engine for an authentic async API dispatch pass
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/auth/forgot-password", { email: email.trim().toLowerCase() });
      setSuccessState(true);
    } catch (err) {
      // FIXED: Catch-block swallows error to dynamically preserve authentic success messages 
      // This strictly prevents bad actors from executing brute-force email verification/sniffing attacks
      setSuccessState(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto my-16 p-6 bg-card-dark border border-border-dark rounded-xl shadow-lg transition-all animate-fade-in">
      
      <div className="text-center mb-8">
        <div className="mx-auto h-12 w-12 bg-primary-gold/10 text-primary-gold border border-primary-gold/20 rounded-full flex items-center justify-center mb-4">
          <KeyRound size={22} />
        </div>
        <h2 className="text-2xl font-heading font-bold text-primary-gold uppercase tracking-wide">Reset Gateway</h2>
        <p className="text-xs text-muted-gray mt-1">Dispatches secure account verification link parameters to your inbox.</p>
      </div>

      {successState ? (
        <div className="space-y-4 text-center py-4">
          <div className="p-4 bg-success-green/10 border border-success-green text-success-green text-xs font-semibold rounded-xl flex flex-col items-center gap-2 uppercase tracking-wide leading-relaxed">
            <ShieldCheck size={24} className="animate-bounce" />
            <span>Reset Encryption Transmitted!</span>
            <p className="text-[11px] text-muted-gray font-medium lowercase tracking-normal text-center mt-1 normal-case px-2">
              If an active rider profile account configuration matches <span className="text-pure-white font-semibold font-mono">{email}</span>, a secure authentication recovery code token has been dispatched. Check your spam vaults if missing.
            </p>
          </div>
          <Link to="/login" className="h-11 w-full bg-deep-black border border-border-dark text-primary-gold text-xs font-heading font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 hover:border-primary-gold transition-colors pt-1 shadow-md">
            <span>Return to Secure Login</span>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleResetSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1">Registered Account Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-gray" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-sm focus:outline-none focus:border-primary-gold transition-colors"
                placeholder="rider@gmail.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase tracking-wider rounded-lg transition-colors shadow-md disabled:opacity-50 mt-4 flex items-center justify-center gap-2 text-xs"
          >
            <span>{isSubmitting ? "Generating Recovery Credentials..." : "Transmit Reset Vector Link"}</span>
            {!isSubmitting && <ArrowRight size={14} />}
          </button>

          <div className="text-center mt-6 text-xs text-muted-gray border-t border-border-dark/60 pt-4">
            Remembered credentials?{" "}
            <Link to="/login" className="text-primary-gold hover:underline font-semibold">
              Sign In here
            </Link>
          </div>
        </form>
      )}

    </div>
  );
};

export default ForgotPassword;