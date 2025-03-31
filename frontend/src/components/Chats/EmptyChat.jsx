import { useContext } from "react";
import { FaPaperPlane, FaUserFriends, FaRegSmile } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";

function EmptyChat({isOpen, setIsOpen}) {
  const { isDarkMode } = useContext(ThemeContext);
  
  return (
    <div className={`flex flex-col items-center justify-center h-full w-[60rem] mx-auto ${
      isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-white to-blue-50'
    } relative overflow-hidden`}>
      {/* Background decoration elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -right-16 -top-16 w-64 h-64 rounded-full ${
          isDarkMode ? 'bg-blue-900/20' : 'bg-blue-200/30'
        }`}></div>
        <div className={`absolute -left-20 -bottom-20 w-80 h-80 rounded-full ${
          isDarkMode ? 'bg-green-900/20' : 'bg-green-300/20'
        }`}></div>
      </div>
      
      {/* Content container */}
      <div className={`relative z-10 max-w-2xl w-full ${
        isDarkMode ? 'bg-gray-900/70' : 'bg-white/70'
      } backdrop-blur-md rounded-2xl p-10 border ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      } shadow-xl`}>
        {/* Floating icons */}
        <div className="absolute -top-6 -right-6">
          <div className={`p-4 rounded-full ${
            isDarkMode ? 'bg-indigo-900/60' : 'bg-indigo-500'
          } shadow-lg`}>
            <FaRegSmile className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="absolute -bottom-6 -left-6">
          <div className={`p-4 rounded-full ${
            isDarkMode ? 'bg-emerald-900/80' : 'bg-emerald-500'
          } shadow-lg`}>
            <FaUserFriends className="w-6 h-6 text-white" />
          </div>
        </div>
        
        {/* Main content */}
        <div className="text-center space-y-8">
          {/* Icon with animated effect */}
          <div className="relative inline-flex mx-auto">
            <div className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
              isDarkMode ? 'bg-blue-500/30' : 'bg-blue-400/30'
            } opacity-75`}></div>
            <div className={`relative p-6 rounded-full ${
              isDarkMode ? 'bg-gradient-to-br from-blue-800 to-indigo-900' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
            }`}>
              <FaPaperPlane className="w-14 h-14 text-white transform -rotate-12" />
            </div>
          </div>
          
          {/* Text content */}
          <div className="space-y-4">
            <h1 className={`text-3xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Start a conversation
            </h1>
            
            <p className={`text-lg max-w-md mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Your chat space is empty. Connect with friends and colleagues to begin messaging.
            </p>
          </div>
          
          {/* Action button */}
          <button className={`inline-flex items-center px-6 py-3 rounded-full ${
            isDarkMode 
              ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-emerald-700 hover:to-green-800' 
              : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-700'
          } text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl`}
          onClick={()=>setIsOpen(!isOpen)}>
            <span>Find contacts</span>
            <FaUserFriends className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Bottom tips */}
      <div className={`mt-8 max-w-lg text-center ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      } text-sm`}>
        Use the search bar at the top to find people or start a new conversation.
      </div>
    </div>
  );
}

export default EmptyChat;