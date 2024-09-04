'use client'; // Ensure this is a Client Component

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Next.js router for navigation

export default function Preferences() {
  const router = useRouter();

  // Preferences state
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [daysRange, setDaysRange] = useState('');
  const [priceRange, setPriceRange] = useState(''); // New state for price range

  // All types of interest
  const placeTypes = [
    'tourist_attraction',
    'amusement_park',
    'art_gallery',
    'church',
    'hindu_temple',
    'museum',
    'park',
    'zoo',
  ];

  // Day options
  const dayOptions = ['1-2 days', '3-5 days', '6-10 days', '11-20 days'];

  // Price range options
  const priceOptions = ['low', 'medium', 'high'];

  const handleTypeSelect = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((item) => item !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleSubmit = () => {
    if (selectedTypes.length === 0 || !daysRange || !priceRange) {
      alert('Please select at least one place type, a day range, and a price range.');
      return;
    }

    // Save preferences in session storage
    sessionStorage.setItem('selectedTypes', JSON.stringify(selectedTypes));
    sessionStorage.setItem('daysRange', daysRange);
    sessionStorage.setItem('priceRange', priceRange); // Save price range

    // Redirect to the recommendations page
    router.push('/recommendations');
  };

  return (
    <div className="min-h-screen py-8 px-24 bg-gray-50 text-gray-800">
      <h1 className="text-5xl font-bold text-center mb-10">Tailor Your Trip</h1>

      {/* Type Selection */}
      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">What interests you?</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {placeTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleTypeSelect(type)}
              className={`p-4 text-lg font-semibold rounded-lg shadow-lg transform transition-transform ${
                selectedTypes.includes(type)
                  ? 'bg-blue-600 text-white scale-105'
                  : 'bg-white text-gray-800 hover:bg-blue-50 hover:scale-105'
              }`}
            >
              {type.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Days Range Selection */}
      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">How long is your trip?</h2>
        <div className="flex flex-wrap gap-6">
          {dayOptions.map((option) => (
            <label key={option} className="text-lg font-semibold flex items-center text-lg">
              <input
                type="radio"
                name="daysRange"
                value={option}
                checked={daysRange === option}
                onChange={(e) => setDaysRange(e.target.value)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Selection */}
      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">What is your budget?</h2>
        <div className="flex flex-wrap gap-6">
          {priceOptions.map((option) => (
            <label key={option} className="font-semibold flex items-center text-lg">
              <input
                type="radio"
                name="priceRange"
                value={option}
                checked={priceRange === option}
                onChange={(e) => setPriceRange(e.target.value)}
                className="mr-2"
              />
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg"
        >
          Generate Recommendations
        </button>
      </div>
    </div>
  );
}
