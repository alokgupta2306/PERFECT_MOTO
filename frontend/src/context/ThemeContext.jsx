import React, { createContext, useState, useEffect, useContext } from "react";

// 1. Create the base context
export const ThemeContext = createContext();

// 2. Your integrated Provider component
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;

    if (darkMode) {
      root.classList.add("dark");
      root.classList.remove("light");
      if (body) {
        body.classList.add("dark");
        body.classList.remove("light");
      }
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      if (body) {
        body.classList.remove("dark");
        body.classList.add("light");
      }
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    // ✅ FIXED (Problem 1): Remapped context variables to match Header.jsx consumer bindings perfectly
    <ThemeContext.Provider value={{ isDarkMode: darkMode, toggleTheme: toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ============================================================================
// Add the missing 'useTheme' consumer hook export
// ============================================================================
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be utilized strictly within a ThemeProvider wrapper.");
  }
  return context;
};