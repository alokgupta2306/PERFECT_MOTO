// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { Mail, Lock, ShieldAlert } from "lucide-react";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const { loginUser, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const redirectDestination = location.state?.from?.pathname || "/account/profile";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);
    
    const result = await loginUser(formData.email, formData.password);
    if (result.success) {
      navigate(result.user.role === "admin" ? "/admin" : redirectDestination, { replace: true });
    } else {
      setErrorMessage(result.error);
    }
    setIsSubmitting(false);
  };

  // Modern Frontend @react-oauth/google Popup Handler Link
  const handleGoogleLoginSuccess = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setErrorMessage("");
      // Directly forwards the client-side authentication access_token to POST /api/auth/google
      const result = await loginWithGoogle(tokenResponse.access_token);
      if (result.success) {
        navigate(result.user.role === "admin" ? "/admin" : redirectDestination, { replace: true });
      } else {
        setErrorMessage(result.error);
      }
    },
    onError: () => setErrorMessage("Google Sign-In rejected.")
  });

  const handleMouseMove = (e) => {
    const card = e.currentTarget.getBoundingClientRect();
    const tiltX = ((e.clientY - (card.top + card.height / 2)) / (card.height / 2)) * -5;
    const tiltY = ((e.clientX - (card.left + card.width / 2)) / (card.width / 2)) * 5;
    setRotation({ x: tiltX, y: tiltY });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.55)",
    border: "1px solid rgba(255,184,0,0.25)",
    color: "#1a1a1a",
    boxShadow: "inset 0 2px 6px rgba(0,0,0,0.08), inset 0 -2px 6px rgba(255,255,255,0.7)"
  };

  const inputFocus = (e) => {
    e.target.style.border = "1px solid rgba(255,184,0,0.6)";
    e.target.style.boxShadow = "inset 0 2px 6px rgba(0,0,0,0.08), 0 0 0 3px rgba(255,184,0,0.15)";
    e.target.style.background = "rgba(255,255,255,0.85)";
  };

  const inputBlur = (e) => {
    e.target.style.border = "1px solid rgba(255,184,0,0.25)";
    e.target.style.boxShadow = "inset 0 2px 6px rgba(0,0,0,0.08), inset 0 -2px 6px rgba(255,255,255,0.7)";
    e.target.style.background = "rgba(255,255,255,0.55)";
  };

  return (
    <div
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-12 px-4 bg-cover bg-center bg-no-repeat select-none"
      style={{ backgroundImage: "url('/background.png')", backgroundColor: "#0d0d0d" }}
    >
      <div className="absolute inset-0 bg-black/55 pointer-events-none z-0" />

      {/* Ambient glow decoration backdrops */}
      <div className="absolute pointer-events-none z-0" style={{ width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,184,0,0.1) 0%, transparent 70%)", top: "-100px", right: "-100px" }} />
      <div className="absolute pointer-events-none z-0" style={{ width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,184,0,0.07) 0%, transparent 70%)", bottom: "-80px", left: "-80px" }} />

      {/* 3D Perspective Canvas Container Frame */}
      <div className="w-full max-w-[640px] z-10" style={{ perspective: "1600px" }}>
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? 1.012 : 1})`,
            transformStyle: "preserve-3d",
            background: "linear-gradient(160deg, #d8d8d8 0%, #d3d3d3 50%, #cecece 100%)",
            border: "1px solid rgba(255,184,0,0.35)",
            boxShadow: `
              0 40px 100px rgba(0,0,0,0.7),
              0 0 0 1px rgba(255,184,0,0.1),
              inset 0 1px 0 rgba(255,255,255,0.8),
              inset 0 -6px 24px rgba(0,0,0,0.08),
              inset 0 6px 24px rgba(255,255,255,0.6)
            `,
            transition: isHovered ? "transform 0.05s ease-out" : "all 0.4s cubic-bezier(0.25,1,0.5,1)"
          }}
          className="w-full px-12 py-10 rounded-[36px]"
        >
          {/* Top aesthetic gold split accent bar */}
          <div style={{ height: 3, background: "linear-gradient(90deg, transparent, #FFB800, #FFDA00, #FFB800, transparent)", borderRadius: 3, marginBottom: 26, boxShadow: "0 0 20px rgba(255,184,0,0.7)", transform: "translateZ(40px)" }} />

          {/* Core App Brand Logo Section Layout */}
          <div className="flex flex-col items-center mb-6" style={{ transform: "translateZ(30px)" }}>
            <img
              src="/logo.png"
              alt="Perfect Moto"
              className="h-16 w-auto object-contain mb-4"
              style={{ maxWidth: 900 }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <h2
              className="text-[34px] font-black uppercase italic leading-none text-center"
              style={{ color: "#1a1a1a", letterSpacing: "-0.02em", fontFamily: "'Arial Black', Impact, sans-serif" }}
            >
              RIDER <span style={{ color: "#cc8800", textShadow: "0 0 16px rgba(255,184,0,0.3)" }}>LOGIN</span>
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] mt-2" style={{ color: "#888" }}>
              One Stop Accessories Store
            </p>
          </div>

          {/* Validation Failure Feedbacks Panel */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl flex items-center gap-2 text-xs font-semibold" style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", color: "#b91c1c" }}>
              <ShieldAlert size={14} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Traditional Email-Password Secure Submission Form Group */}
          <form onSubmit={handleFormSubmit} className="space-y-[14px]" style={{ transform: "translateZ(20px)" }}>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: "#cc8800" }} />
              <input 
                type="email" 
                name="email" 
                required 
                value={formData.email} 
                onChange={handleInputChange}
                style={inputStyle} 
                onFocus={inputFocus} 
                onBlur={inputBlur}
                className="w-full h-[50px] pl-[44px] pr-4 rounded-[16px] text-sm font-medium placeholder-[#999] focus:outline-none transition-all border-none"
                placeholder="Email Address" 
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: "#cc8800" }} />
              <input 
                type="password" 
                name="password" 
                required 
                value={formData.password} 
                onChange={handleInputChange}
                style={inputStyle} 
                onFocus={inputFocus} 
                onBlur={inputBlur}
                className="w-full h-[50px] pl-[44px] pr-4 rounded-[16px] text-sm font-medium placeholder-[#999] focus:outline-none transition-all border-none"
                placeholder="Password" 
              />
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs font-bold decoration-none" style={{ color: "#cc8800" }}>
                Forgot Password?
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{
                background: "linear-gradient(135deg, #FFB800 0%, #FFDA00 50%, #FFB800 100%)",
                boxShadow: "0 8px 24px rgba(255,184,0,0.4), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -3px 0 rgba(0,0,0,0.15)",
                color: "#111111", 
                fontFamily: "'Arial Black', Impact, sans-serif", 
                letterSpacing: "0.12em"
              }}
              className="w-full h-[50px] rounded-[16px] text-sm font-black uppercase disabled:opacity-50 transform active:translate-y-0.5 mt-1 border-transparent cursor-pointer"
            >
              {isSubmitting ? "Authenticating..." : "Login →"}
            </button>
          </form>

          {/* Visual Operational Flow Partition Matrix Split */}
          <div className="flex items-center gap-3 my-5" style={{ transform: "translateZ(10px)" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.1)" }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#999" }}>Or</span>
            <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.1)" }} />
          </div>

          {/* OAuth Google Popup Call Button Action Component */}
          <button 
            type="button" 
            onClick={() => handleGoogleLoginSuccess()}
            style={{ 
              background: "rgba(255,255,255,0.6)", 
              border: "1px solid rgba(0,0,0,0.1)", 
              color: "#444", 
              transform: "translateZ(15px)", 
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 6px rgba(0,0,0,0.08)" 
            }}
            className="w-full h-[48px] font-bold rounded-[16px] flex items-center justify-center gap-3 text-sm cursor-pointer border-solid"
          >
            <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </button>

          <p className="text-center mt-5 text-xs font-medium" style={{ color: "#777", transform: "translateZ(10px)" }}>
            Not registered?{" "}
            <Link to="/register" className="font-bold decoration-none" style={{ color: "#cc8800" }}>Create account</Link>
          </p>

          {/* Lower layout border line */}
          <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,184,0,0.5), transparent)", marginTop: 22, transform: "translateZ(40px)" }} />
        </div>
      </div>
    </div>
  );
};

export default Login;