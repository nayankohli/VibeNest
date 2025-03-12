import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./components/registerScreen/Register";
import Login from "./components/loginScreen/Login";
import Home from "./components/HomeScreen/Home";
import ProfilePage from "./components/Profile/profilePage/ProfilePage";
import EditProfile from "./components/Profile/editProfile/EditProfile";
import ChatPage from "./components/Chats/ChatPage";
import Settings from "./components/NavBarMainScreen/Settings/Settings";
import { Toaster } from "sonner";
import { ThemeProvider } from "./context/ThemeContext"; // ✅ Correct import
// ✅ Import ThemeProvider

function App() {
  return (
    <ThemeProvider> {/* ✅ Wrap everything inside ThemeProvider */}
      <Toaster /> {/* ✅ Place Toaster outside of Routes */}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;