// src/components/CitySearch.js

'use client'; // Ensure this is a Client Component

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Use Next.js router for navigation

export default function CitySearch() {
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [heading, setHeading] = useState(''); // State to manage heading animation
  const router = useRouter(); // Next.js router instance

  const fullHeading = '🧳Trip Tailor'; // Full heading text

  useEffect(() => {
    const animateHeading = () => {
      let currentText = '';
      let index = 0;

      const typingInterval = setInterval(() => {
        if (index < fullHeading.length) {
          currentText += fullHeading[index];
          setHeading(currentText);
          index++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => {
            setHeading(''); // Clears the heading after it is fully displayed
          }, 2000); // 2-second delay before clearing the heading
        }
      }, 150); // Adjust speed of typing effect here
    };

    // Start the initial animation
    animateHeading();

    // Set an interval to repeat the animation every 8 seconds (same as the CSS animation duration)
    const intervalId = setInterval(() => {
      animateHeading();
    }, 8000); // Adjust based on your animation duration

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  const handleSearch = async () => {
    if (!city) return;

    try {
      const response = await axios.get(`/api/find-place`, {
        params: { input: city }
      });

      if (response.data.coordinates) {
        sessionStorage.setItem('latitude', response.data.coordinates.split(',')[0]);
        sessionStorage.setItem('longitude', response.data.coordinates.split(',')[1]);
        sessionStorage.setItem('city', city);
        router.push('/preferences');
      } else {
        setError('City not found');
      }
    } catch (error) {
      console.error('Error fetching city:', error);
      setError('An error occurred while fetching the city data');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-5xl font-extrabold mb-6 text-gray-900 trip-tailor-heading">{heading}</h1>
      <h2 className="text-4xl font-bold mb-6 text-gray-900">Enter Your Dream Destination</h2>
      <p className="text-lg text-gray-700 mb-8">
        {`Enter the name of the city you want to explore, and we'll help you create an unforgettable travel plan.`}
      </p>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter a city name"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
        />
        <button
          onClick={handleSearch}
          className="w-full bg-gray-800 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-900 transition-colors duration-200"
        >
          Search
        </button>
        {error && (
          <div className="mt-4 text-red-500">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
