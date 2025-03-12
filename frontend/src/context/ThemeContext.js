import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("bg-gray-900", "text-white");
      document.body.classList.remove("bg-white", "text-gray-900");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("bg-white", "text-gray-900");
      document.body.classList.remove("bg-gray-900", "text-white");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
