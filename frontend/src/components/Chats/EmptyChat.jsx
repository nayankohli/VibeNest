// EmptyChat.jsx
import { useContext } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";

function EmptyChat() {
  const { isDarkMode } = useContext(ThemeContext);
  
  return (
    <div className={`flex flex-col items-center justify-center mx-auto ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} w-[60rem]`}>
      <FaPaperPlane className={`${isDarkMode ? 'text-blue-300' : 'text-blue-400'} w-20 h-20`} />
      <h1 className="font-medium text-center mt-4">Your messages</h1>
      <span className={`text-center ${isDarkMode ? 'text-gray-400' : ''}`}>Send a message to start a chat.</span>
    </div>
  );
}

export default EmptyChat;