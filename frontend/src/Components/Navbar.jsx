import React, { useState } from 'react'
import Profile from './Profile';
import { useNavigate } from "react-router-dom";
import SearchBar from './SearchBar';

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
 
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className='bg-black flex items-center justify-between px-6 py-2 drop-shadow-xl'>
        <h2 className='text-xl font-medium text-white py-2'>AIMS PORTAL</h2>
        {userInfo && <Profile userInfo={userInfo} onLogout={onLogout} />}
    </div>
  );
}

export default Navbar;
