// src/app/plan/page.js
'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JourneyDetails from '../components/journeyDetails';

const RoutePlan = () => {
  const [journeyData, setJourneyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRouteData = async () => {
      const selectedPlaces = JSON.parse(sessionStorage.getItem('selectedPlaces'));
      const latitude = sessionStorage.getItem('latitude');
      const longitude = sessionStorage.getItem('longitude');
      const priceRange = sessionStorage.getItem('priceRange');
      const city = sessionStorage.getItem('city');

      if (selectedPlaces && selectedPlaces.length > 0) {
        try {
          const response = await axios.post('/api/plan-route', {
            placeIds: selectedPlaces,
            latitude,
            longitude,
            priceRange,
          });

          const { final_routes, final_durations } = response.data;
          setJourneyData({ final_routes, final_durations,city });
          setLoading(false);
        } catch (error) {
          console.error('Error fetching route data:', error);
          setLoading(false);
        }
      }
    };

    fetchRouteData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="loader border-t-4 border-b-4 border-blue-500 rounded-full w-16 h-16 mb-4 animate-spin"></div>
          <p className="text-xl font-semibold text-gray-700">Loading your tour plan...</p>
        </div>
      </div>
    );
  }

  if (!journeyData) {
    return <div>No data available</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="bg-blue-500 text-white py-4 px-8 shadow-md">
        <h1 className="text-3xl font-bold">Tour Plan to Bangalore</h1>
      </header>

      {/* Journey Details Section */}
      <JourneyDetails data={journeyData} />
    </div>
  );
};

export default RoutePlan;
