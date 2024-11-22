import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Register from './components/Register'; 
import Login from './components/Login'; 
import Home from './components/Home';
import ProfilePage from './components/ProfilePage';
import EditProfile from './components/EditProfile';
// import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protect sensitive routes */}
        <Route
          path="/home"
          element={
              <Home />
          }
        />
        <Route
          path="/profile"
          element={
           
              <ProfilePage />
            
          }
        />
        <Route
          path="/edit-profile"
          element={
              <EditProfile />
          }
        />
      </Routes>
  );
}

export default App;
