'use client';

import React, { useContext } from 'react';
import Link from 'next/link';
import { UserContext } from '../../context/UserContext';

const Header = () => {
  const { user, logoutUser } = useContext(UserContext);

  return (
    <header className="bg-blue-600 p-4 text-white shadow-lg flex justify-between items-center">
      {/* Website Logo and Name */}
      <Link href="/" className="text-3xl font-extrabold tracking-wide flex items-center space-x-2">
        <span className="text-yellow-400">🧳</span>
        <span>TripTailor</span>
      </Link>

      {/* Navigation Links */}
      <nav className="flex items-center space-x-6">
        {user ? (
          <>
            <span className="text-gray-200">Welcome, <span className="font-bold text-xl text-yellow-300">{user.username}</span></span>
            <Link href="/saved-plans" className="text-lg hover:text-yellow-300 transition duration-300 ease-in-out">
              Saved Plans
            </Link>
            <button
              onClick={logoutUser}
              className="bg-yellow-400 text-gray-800 px-4 py-2 rounded-lg hover:bg-yellow-500 transition duration-300 ease-in-out"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/register" className="hover:text-yellow-300 transition duration-300 ease-in-out">
              Register
            </Link>
            <Link href="/login" className="hover:text-yellow-300 transition duration-300 ease-in-out">
              Login
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
