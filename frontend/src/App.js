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
import ChatProvider from "./context/ChatProvider"; 
import SavedPosts from "./components/SavedPosts/SavedPosts";
import NewsPage from "./components/HomeScreen/RightSideBar/NewsPage";
function App() {
  return (
    <ThemeProvider> 
      <ChatProvider> 
        <Toaster /> 
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/saved" element={<SavedPosts />} />
          <Route path="/chats" element={<ChatPage />} />
          <Route path="/news" element={<NewsPage />} />
        </Routes>
      </ChatProvider>
    </ThemeProvider>
  );
}

export default App;
