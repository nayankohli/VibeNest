import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import ChatSidebar from "../Chats/ChatSidebar";

const MessageSideDrawer = ({ onClose }) => {
    const { isDarkMode } = useContext(ThemeContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50);
  
      return () => clearTimeout(timer);
    }, []);
  
    const handleClose = () => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    };
  
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex "
        onClick={handleClose}
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className={`
            fixed 
            top-0 
            right-0 
            w-[30rem] 
            h-full 
            transform 
            transition-transform 
            duration-300 
            ease-in-out
            ${isVisible ? 'translate-x-0' : 'translate-x-full'}
            ${isDarkMode ? "bg-gray-800 border-l border-t text-white" : "bg-white"}
            shadow-2xl 
            z-70
          `}
        >
          <button 
          className={`absolute z-10 top-3 left-3 text-lg text-gray-400`} 
          onClick={handleClose}
        >
          ✖
        </button>
          <div>
            <ChatSidebar calledBy={"home"} isOpen={isOpen} setIsOpen={setIsOpen}/>
          </div>
        </div>
      </div>
    );
  };

export default MessageSideDrawer;