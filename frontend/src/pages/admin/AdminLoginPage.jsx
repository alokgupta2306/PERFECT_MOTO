import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, Mail, ShieldAlert } from "lucide-react";
import api from "../../utils/api";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errorFeedback, setErrorFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorFeedback("");
    setIsSubmitting(true);

    try {
      const res = await api.post("/auth/login", {
        email: credentials.email,
        password: credentials.password,
      });

      const { token, user } = res.data;

      // Check if user is actually admin
      if (user.role !== "admin") {
        setErrorFeedback("Access denied. Admin credentials required.");
        setIsSubmitting(false);
        return;
      }

      // Save admin token separately
      localStorage.setItem("perfectmoto_admin_token", token);
      localStorage.setItem("token", token);

      navigate("/admin", { replace: true });

    } catch (err) {
      setErrorFeedback(
        err.response?.data?.message || "Security credentials rejected."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-black flex items-center justify-center p-4 font-body">
      <div className="max-w-md w-full bg-card-dark border border-border-dark p-8 rounded-xl shadow-gold-glow">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-primary-gold/10 text-primary-gold border border-primary-gold/20 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck size={24} />
          </div>
          <h2 className="text-2xl font-heading font-bold text-primary-gold uppercase tracking-wide">
            Back-Office Terminal
          </h2>
          <p className="text-xs text-muted-gray mt-1">
            Authorized admin access only.
          </p>
        </div>

        {errorFeedback && (
          <div className="mb-4 p-3 bg-error-red/10 border border-error-red text-error-red text-xs rounded-lg flex items-center gap-2 font-semibold">
            <ShieldAlert size={16} />
            <span>{errorFeedback}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-gray" size={16} />
              <input
                type="email"
                required
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full h-10 pl-10 pr-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold"
                placeholder="admin@perfectmoto.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-gray" size={16} />
              <input
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full h-10 pl-10 pr-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold tracking-widest"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase tracking-wider text-xs rounded-lg transition-colors disabled:opacity-50 mt-6"
          >
            {isSubmitting ? "Authenticating..." : "Login to Admin Panel"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;