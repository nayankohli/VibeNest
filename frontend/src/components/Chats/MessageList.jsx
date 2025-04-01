// MessageList.jsx
import { useContext } from "react";
import { useSelector } from "react-redux";
import Message from "./Message";
import Loading from "../Loaders/Loading";
import { ThemeContext } from "../../context/ThemeContext";
function MessageList({ loading ,messages, fetchAgain, setFetchAgain, setMessages}) {
  const { isDarkMode } = useContext(ThemeContext);
  if (loading) {
    return <Loading />;
  }
  
  return (
    <div className="flex flex-col gap-2">
      {messages && messages.length > 0 ? (
        <div>
<Message messages={messages} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} setMessages={setMessages} />

        </div>
        
        
      ) : (
        <div className="text-center text-gray-500 my-4">
          No messages yet. Start a conversation!
        </div>
      )}
    </div>
  );
}

export default MessageList;