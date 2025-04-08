import React from 'react';

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  const isAdmin = admin === user._id;
  
  return (
    <div
      className="inline-flex items-center gap-1 px-3 py-1.5 m-1 mb-2 text-sm font-medium rounded-full cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-md group"
      style={{
        background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
        boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)'
      }}
      onClick={handleFunction}
    >
      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-indigo-700 text-xs font-bold mr-1">
        {user.name.charAt(0).toUpperCase()}
      </div>
      <span className="text-white">
        {user.name}
      </span>
      {isAdmin && (
        <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold bg-white bg-opacity-20 text-white rounded-md">
          Admin
        </span>
      )}
      <button 
        className="ml-1 flex items-center justify-center w-4 h-4 rounded-full text-white text-xs opacity-70 group-hover:opacity-100 group-hover:bg-red-500 transition-all duration-300"
        aria-label="Remove user"
      >
        &times;
      </button>
    </div>
  );
};

export default UserBadgeItem;