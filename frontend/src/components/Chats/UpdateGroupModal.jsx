import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import { ThemeContext } from "../../context/ThemeContext";
import { useSelector } from "react-redux";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import { toast } from "sonner";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedChat, setSelectedChat, user } = ChatState();
  const defaultProfileImage =
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);
  
  // For managing the image state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  const { userInfo } = useSelector((state) => state.userLogin);

  // Update state when selected chat changes or modal opens
  useEffect(() => {
    if (selectedChat && isOpen) {
      setGroupChatName(selectedChat.chatName || "");
      setPreviewImage(null);
      setSelectedFile(null);
    }
  }, [selectedChat, isOpen]);

  const handleAddUser = async (user1) => {
    if (selectedChat.participants.find((u) => u._id === user1._id)) {
      toast.error("User already in group!", {
        style: {
          background: "red",
          color: "white",
          fontWeight: "bold",
          padding: "14px 20px",
          boxShadow: "0px 6px 15px rgba(22, 163, 74, 0.3)",
          borderRadius: "12px",
          border: "2px solid #38bdf8",
          textAlign: "center",
          letterSpacing: "0.5px",
          transition: "transform 0.3s ease-in-out",
        },
        position: "top-center",
        duration: 3000,
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admins can add someone in group!", {
        style: {
          background: "red",
          color: "white",
          fontWeight: "bold",
          padding: "14px 20px",
          boxShadow: "0px 6px 15px rgba(22, 163, 74, 0.3)",
          borderRadius: "12px",
          border: "2px solid #38bdf8",
          textAlign: "center",
          letterSpacing: "0.5px",
          transition: "transform 0.3s ease-in-out",
        },
        position: "bottom-right",
        duration: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      const res = await axios.get(
        `http://localhost:5000/api/message/search?query=${query}`,
        config
      );

      console.log("Fetched users:", res.data.users);
      setSearchResult([...res.data.users]);
      setLoading(false);
    } catch (error) {
      console.error("Search API Error:", error);
      setSearchResult([]);
      setLoading(false);
    }
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = { 
        headers: { 
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        } 
      };
      
      const formData = new FormData();
      formData.append("chatId", selectedChat._id);
      formData.append("chatName", groupChatName);
      
      // Only append file if a new one was selected
      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      const { data } = await axios.put(
        "http://localhost:5000/api/chat/update",
        formData,
        config
      );
      
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating group:", error);
      setRenameLoading(false);
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      alert("Only admins can remove someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      alert("error occured");
      setLoading(false);
    }
  };

  // Get the current image to display (preview or server image)
  const getDisplayImage = () => {
    if (previewImage) {
      return previewImage;
    } else if (selectedChat?.profileImage) {
      return `http://localhost:5000${selectedChat.profileImage}`;
    } else {
      return defaultProfileImage;
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`${
          isDarkMode
            ? "bg-gray-600 hover:bg-gray-500"
            : "bg-gray-300 hover:bg-gray-400"
        } text-md font-medium p-1 px-3 rounded-lg`}
      >
        Group Details
      </button>
      {isOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center ${
            isDarkMode ? "bg-black bg-opacity-70" : "bg-black bg-opacity-50"
          }`}
        >
          <div
            className={`w-96 p-5 rounded-lg shadow-lg ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            <div
              className={`flex justify-between items-center border-b pb-2 ${
                isDarkMode ? "border-gray-700" : "border-gray-300"
              }`}
            >
              <h2 className="text-xl font-bold">{selectedChat.chatName}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-red-500 text-3xl top-[-2rem] relative"
              >
                &times;
              </button>
            </div>
            <div className="mt-4 flex-flex-col items-center">
              <div className="flex gap-2 items-center my-4">
                <div className="rounded-full">
                  <img
                    src={getDisplayImage()}
                    alt="Group"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 shadow-md"
                  />
                </div>

                <input
                  type="file"
                  accept="image/*"
                  id="group-photo-input"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <button
                  onClick={() =>
                    document.getElementById("group-photo-input").click()
                  }
                  className={`${
                    isDarkMode
                      ? "bg-green-900 text-green-300"
                      : "bg-green-100 text-green-600"
                  } hover:bg-green-600 hover:text-white font-semibold px-4 py-2 rounded-lg my-4 mt-2 `}
                >
                  Change Image
                </button>
              </div>
              <input
                type="text"
                placeholder="Rename Group"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                className={`w-full p-2 border rounded ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "border-gray-300"
                }`}
              />
              <button
                onClick={handleUpdate}
                className={` ${
                  isDarkMode
                    ? "bg-green-900 text-green-300"
                    : "bg-green-100 text-green-600"
                } hover:bg-green-600 hover:text-white font-semibold px-4 py-2 rounded mt-2 w-full`}
                disabled={renameLoading}
              >
                {renameLoading ? "Updating..." : "Update"}
              </button>
            </div>
            <div className="flex flex-wrap">
              {selectedChat.participants.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </div>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search Users"
                onChange={(e) => handleSearch(e.target.value)}
                className={`w-full p-2 border rounded ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "border-gray-300"
                }`}
              />
              <div className="mt-2 max-h-40 overflow-y-auto">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  searchResult.map((user) => (
                    <div
                      key={user._id}
                      className={`p-2 border-b ${
                        isDarkMode ? "border-gray-700" : "border-gray-300"
                      }`}
                      onClick={() => {
                        handleAddUser(user);
                      }}
                    >
                      {user.name}
                    </div>
                  ))
                )}
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={` ${
                isDarkMode
                  ? "bg-red-900 text-red-300"
                  : "bg-red-100 text-red-600"
              } hover:bg-red-600 hover:text-white font-semibold px-4 py-2 rounded mt-2 w-full`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateGroupChatModal;