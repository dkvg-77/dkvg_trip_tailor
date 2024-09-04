// src/app/components/SavePlanButton.js

'use client';

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { UserContext } from '../../context/UserContext';

const SavePlanButton = ({ uniqueId }) => {
  const { user } = useContext(UserContext);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user && uniqueId) {
      const checkIfSaved = async () => {
        try {
          const response = await axios.post(`/api/check-plan-saved/${uniqueId}`,{ user });
          setIsSaved(response.data.isSaved);
          setLoading(false);
        } catch (error) {
          console.error('Error checking if plan is saved:', error);
          setLoading(false);
        }
      };

      checkIfSaved();
    } else {
      setLoading(false);
    }
  }, [user, uniqueId]);

  const handleSavePlan = async () => {
    if (!user) {
      router.push('/login'); // Redirect to login page if not logged in
      return;
    }

    try {
      console.log(user);
      await axios.post(`/api/save-plan/${uniqueId}`, { user });
      setIsSaved(true);
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return (
      <button onClick={() => router.push('/login')} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        Login and save this tour-plan
      </button>
    );
  }

  if (isSaved) {
    return <p className="text-green-500 text-lg font-bold">Tour-plan is saved</p>;
  }

  return (
    <button onClick={handleSavePlan} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
      Save this tour-plan
    </button>
  );
};

export default SavePlanButton;
