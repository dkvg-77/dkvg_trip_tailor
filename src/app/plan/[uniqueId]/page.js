// src/app/plan/[uniqueId]/page.js
'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JourneyDetails from '../../components/journeyDetails';
import SavePlanButton from '../../components/SavePlanButton'; // Import the new component
import { useRouter } from 'next/navigation';

const RoutePlan = ({ params }) => {
     const [journeyData, setJourneyData] = useState(null);
     const [loading, setLoading] = useState(true);
     const router = useRouter();
     const { uniqueId } = params; 

     useEffect(() => {
          if (!uniqueId) return;

          const fetchRouteData = async () => {
               try {
                    const response = await axios.get(`/api/get-plan/${uniqueId}`);
                    const { final_routes, final_durations, city } = response.data;
                    setJourneyData({ final_routes, final_durations, city });
                    setLoading(false);
               } catch (error) {
                    console.error('Error fetching route data:', error);
                    setLoading(false);
               }
          };

          fetchRouteData();
     }, [uniqueId]);
     
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
               <header className="bg-white py-4 px-8 shadow-md flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">
                         Tour Plan to <span className="text-blue-600">{journeyData.city}</span>
                    </h1>
                    {/* Save Plan Button on the top right */}
                    <SavePlanButton uniqueId={uniqueId} />
               </header>

               {/* Journey Details Section */}
               <JourneyDetails data={journeyData} />
          </div>
     );
};

export default RoutePlan;
