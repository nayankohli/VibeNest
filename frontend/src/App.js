import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Register from './components/Register'; 
import Login from './components/Login'; 
import Home from './components/Home';
import ProfilePage from './components/ProfilePage';
import { UserProvider } from './components/UserContext';
import EditProfile from './components/EditProfile';

function App() {
  return (
    <UserProvider>  {/* Only wrap with UserProvider here */}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<EditProfile />} /> 
        {/* Add other routes here */}
      </Routes>
    </UserProvider>
  );
}

export default App;
