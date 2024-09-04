'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Recommendations() {
  const [places, setPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [maxSelection, setMaxSelection] = useState(5); // Default maximum selection
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const router = useRouter();

  useEffect(() => {
    // Fetch saved preferences from sessionStorage
    const latitude = sessionStorage.getItem('latitude');
    const longitude = sessionStorage.getItem('longitude');
    const selectedTypes = JSON.parse(sessionStorage.getItem('selectedTypes'));
    const daysRange = sessionStorage.getItem('daysRange');
    const city = sessionStorage.getItem('city');

    // Set the max number of selectable places based on daysRange
    switch (daysRange) {
      case '1-2 days':
        setMaxSelection(5);
        break;
      case '3-5 days':
        setMaxSelection(12);
        break;
      case '6-10 days':
        setMaxSelection(20);
        break;
      case '11-20 days':
        setMaxSelection(30);
        break;
      default:
        setMaxSelection(5); // Default fallback
    }

    // Fetch recommended places from the backend
    axios.post('/api/nearby-places', { latitude, longitude, selectedTypes, daysRange })
      .then(response => setPlaces(response.data.places))
      .catch(error => console.error('Error fetching recommended places:', error));
  }, []);

  const handleSelectPlace = (place_id) => {
    setSelectedPlaces((prev) => {
      if (prev.includes(place_id)) {
        return prev.filter(id => id !== place_id);
      }
      if (prev.length < maxSelection) {
        return [...prev, place_id];
      }
      return prev;
    });
  };

  const handleGeneratePlan = async () => {
    if (selectedPlaces.length === 0) {
      alert('Please select at least one place to generate a plan.');
      return;
    }

    // Set loading state to true
    setIsLoading(true);

    try {
      const latitude = sessionStorage.getItem('latitude');
      const longitude = sessionStorage.getItem('longitude');
      const priceRange = sessionStorage.getItem('priceRange');
      const city = sessionStorage.getItem('city');
      
      // API call to generate the final route and save to the database
      const response = await axios.post('/api/generate-plan', {
        placeIds: selectedPlaces,
        latitude,
        longitude,
        priceRange,
        city
      });

      const { uniqueId } = response.data; // Get the unique ID from the response

      // Redirect to the dynamic page with the unique ID
      router.push(`/plan/${uniqueId}`);
    } catch (error) {
      console.error('Error generating plan:', error);
    } finally {
      // Set loading state to false after the process is complete
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-28 bg-gray-50 text-gray-800">
      <h1 className="text-4xl font-bold mb-8 text-center">Recommended Places to Visit</h1>
      
      {/* Message showing the maximum places user can select */}
      <p className="mb-6 text-lg text-center text-gray-600">
        {`Select up to ${maxSelection} places`}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
        {places.map((place) => (
          <div 
            key={place.place_id} 
            className={`bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transform transition duration-300 ${selectedPlaces.includes(place.place_id) ? 'border-4 border-blue-600' : ''}`}
          >
            <img
              src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`}
              alt={place.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h2 className="text-lg font-semibold text-gray-700">{place.name}</h2>
            <p className="text-sm text-gray-500 mb-4">Rating: {place.rating}</p>
            <button
              className={`w-full py-2 rounded-lg font-semibold text-white transition-colors duration-200 ${
                selectedPlaces.includes(place.place_id) ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
              }`}
              onClick={() => handleSelectPlace(place.place_id)}
              disabled={selectedPlaces.length >= maxSelection && !selectedPlaces.includes(place.place_id)}
            >
              {selectedPlaces.includes(place.place_id) ? 'Deselect' : 'Select'}
            </button>
          </div>
        ))}
      </div>

      {/* Generate Plan Button with Loading Animation */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={handleGeneratePlan}
          className={`bg-green-500 text-white py-3 px-10 rounded-lg font-semibold transition-colors duration-200 shadow-lg flex items-center justify-center ${
            isLoading ? 'cursor-not-allowed bg-green-400' : 'hover:bg-green-600'
          }`}
          disabled={isLoading || selectedPlaces.length === 0}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Generating a plan...
            </>
          ) : (
            'Generate Plan'
          )}
        </button>
      </div>
    </div>
  );
}
