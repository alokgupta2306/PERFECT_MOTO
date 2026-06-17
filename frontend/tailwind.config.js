/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // Enables our Day/Night vision switching via a class on the body element
  theme: {
    extend: {
      colors: {
        "primary-gold": "#FFB800",
        "gold-hover": "#FFC933",
        "gold-dark": "#B8860B",
        "deep-black": "#0A0A0A", // Main background dark mode default
        "card-dark": "#1A1A1A",
        "border-dark": "#2A2A2A",
        "pure-white": "#FFFFFF",
        "muted-gray": "#666666",
        "light-gray": "#F5F5F5", // Light mode card background
        "success-green": "#22C55E",
        "error-red": "#EF4444",
        "warning-amber": "#F59E0B",
        "info-blue": "#3B82F6",
      },
      fontFamily: {
        heading: ["Rajdhani", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        "gold-glow": "0 0 20px rgba(255, 184, 0, 0.25)",
        "gold-glow-lg": "0 0 40px rgba(255, 184, 0, 0.35)",
      },
    },
  },
  plugins: [],
}