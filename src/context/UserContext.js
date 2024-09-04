// src/context/UserContext
'use client';

import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if a user token is present in localStorage
    const token = localStorage.getItem('userToken');
    if (token) {
      const decodedUser = jwtDecode(token); // Decode token to get user data
      setUser(decodedUser); // Set the user state
    }
  }, []);

  const loginUser = (token) => {
    localStorage.setItem('userToken', token);
    const decodedUser = jwtDecode(token); // Decode token to get user data
    setUser(decodedUser); // Set the user state
  };

  const logoutUser = () => {
    localStorage.removeItem('userToken');
    setUser(null); // Reset user state to null
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
