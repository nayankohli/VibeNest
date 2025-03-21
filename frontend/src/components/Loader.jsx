import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const Loader = () => {
  const { isDarkMode } = useContext(ThemeContext);
  
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        {/* Spinner */}
        <div className={`w-12 h-12 rounded-full absolute
                        border-4 border-solid ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}></div>
        <div className={`w-12 h-12 rounded-full animate-spin absolute
                        border-4 border-solid border-transparent
                        ${isDarkMode ? "border-t-blue-400" : "border-t-blue-600"}`}></div>
        
        {/* Optional loading text */}
        <div className={`mt-16 text-center ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
          Loading...
        </div>
      </div>
    </div>
  );
};

export default Loader;