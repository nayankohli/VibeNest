import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const Loader = () => {
  const { isDarkMode } = useContext(ThemeContext);
  
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    </div>
  );
};

export default Loader;