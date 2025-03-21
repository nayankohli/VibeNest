import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./components/registerScreen/Register";
import Login from "./components/loginScreen/Login";
import Home from "./components/HomeScreen/Home";
import ProfilePage from "./components/Profile/profilePage/ProfilePage";
import ChatPage from "./components/Chats/ChatPage";
import Settings from "./components/NavBarMainScreen/Settings/Settings";
import { Toaster } from "sonner";
import { ThemeProvider } from "./context/ThemeContext";
import ChatProvider from "./context/ChatProvider"; // ✅ Correct import
import SavedPosts from "./components/SavedPosts/SavedPosts";
function App() {
  return (
    <ThemeProvider> {/* ✅ Wrap everything inside ThemeProvider */}
      <ChatProvider> {/* ✅ Move ChatProvider outside of Routes */}
        <Toaster /> {/* ✅ Place Toaster outside of Routes */}
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/saved" element={<SavedPosts />} />
          <Route path="/chats" element={<ChatPage />} />
        </Routes>
      </ChatProvider>
    </ThemeProvider>
  );
}

export default App;
