'use client'
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { UserContext } from '../../context/UserContext';

const SavedPlansPage = () => {
  const [savedPlans, setSavedPlans] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchSavedPlans = async () => {
      try {
        if (user && user.username) {
          const response = await axios.get(`/api/saved-plans?username=${user.username}`);
          setSavedPlans(response.data.savedPlans);
        }
      } catch (error) {
        console.error('Error fetching saved plans:', error);
      }
    };

    fetchSavedPlans();
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-28">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-lg shadow-lg mb-6">
        <h1 className="text-3xl font-bold text-center">Your Saved Plans</h1>
        <p className="text-center mt-2 text-blue-100">Explore all your saved tour plans in one place.</p>
      </div>

      {/* Saved Plans List */}
      <ul className="space-y-4">
        {savedPlans.length === 0 ? (
          <p className="text-center text-gray-600">You have no saved plans.</p>
        ) : (
          savedPlans.map((savedPlan, index) => (
            <li
              key={index}
              className="flex items-start p-4 bg-white rounded-lg shadow-md hover:bg-gray-50 transition transform hover:scale-105"
            >
              <span className="text-lg font-semibold text-blue-600 mr-4">{index + 1}.</span>
              <Link href={`/plan/${savedPlan.plan_id.unique_id}`}>
                <span className="text-lg text-blue-600 hover:underline">
                  Tour plan to {savedPlan.plan_id.city}
                </span>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SavedPlansPage;
