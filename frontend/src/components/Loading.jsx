import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
const Loading = ({ size = 200 }) => {
  const d = size / 5; // Derive the base value for animation
const {isDarkMode}=useContext(ThemeContext)
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center w-full h-screen ${isDarkMode?'bg-gray-900':'bg-white'}`}>
      <div 
        className="relative animate-spin"
        style={{
          width: `${d / 5}px`,
          height: `${d / 5}px`,
          borderRadius: '50%',
          color: '#258c2d',
          boxShadow: `
            ${1 * d}px ${0 * d}px 0 0,
            ${0.707 * d}px ${0.707 * d}px 0 1px,
            ${0 * d}px ${1 * d}px 0 2px,
            ${-0.707 * d}px ${0.707 * d}px 0 3px,
            ${-1 * d}px ${0 * d}px 0 4px,
            ${-0.707 * d}px ${-0.707 * d}px 0 5px,
            ${0 * d}px ${-1 * d}px 0 6px
          `,
        }}
      />
    </div>
  );
};

export default Loading;