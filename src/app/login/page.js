// src/app/login/page.js
'use client';

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { UserContext } from '../../context/UserContext';

const LoginPage = () => {
  const router = useRouter();
  const { loginUser } = useContext(UserContext); // Access the loginUser function from UserContext
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous error
    try {
      const response = await axios.post('/api/login', { username, password }); 
      const { token } = response.data;

      // Save JWT token to context and localStorage
      loginUser(token);
      
      console.log("User connected");
      router.back(); // Redirect to the previous page
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-blue-300 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Login to Your Account</h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md transition duration-300"
          >
            Login
          </button>
        </form>
        
        <div className="text-center">
          <p className="text-gray-600">{`Don't have an account?`} <a href="/register" className="text-blue-600 hover:text-blue-800">Register</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
