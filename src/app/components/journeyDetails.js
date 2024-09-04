'use client'
import React from 'react';
import { FaBusAlt } from 'react-icons/fa'; // Bus icon for travel indication

const JourneyDetails = ({ data }) => {
  const { final_routes, final_durations, city } = data; 
  console.log(data.city);
  const getVisitDuration = (types) => {
    const typeDurationMapping = {
      amusement_park: 4,
      tourist_attraction: 2,
      museum: 2,
      park: 2,
      zoo: 2,
      art_gallery: 1.5,
      hindu_temple: 1.5,
      church: 1,
      mosque: 1,
      food: 0.75,
    };

    for (const type of Object.keys(typeDurationMapping)) {
      if (types.includes(type)) {
        return typeDurationMapping[type];
      }
    }
    return 0; // Default duration if no type matches
  };

  let i = 0; // Index for travel durations
  let dayCount = 1; // Start with Day 1

  return (
    <div className="container mx-auto p-4">
      {/* Day 1 Heading */}
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-blue-800">Day {dayCount}</h2>
        <hr className="my-4 border-blue-300" />
      </div>

      {final_routes.map((place, index) => {
        // Ensure to reset `i` when the loop reaches the last index
        if (index === final_routes.length - 1) {
          i = 0;
        }

        let dur = final_durations[i]?.duration;
        let dist = final_durations[i]?.distance;
        const visitDuration = getVisitDuration(place.types);
        const travelDuration = dur / 60; // Convert seconds to minutes
        const travelDistance = dist / 1000; // Convert meters to kilometers
        i++;

        const isStartOfJourney = index === 0;
        const isEndOfJourney = index === final_routes.length - 1;
        const showDayEnd = place.isdayend === 2;

        const details = (
          <div
            key={place.placeId}
            className={`bg-white rounded-lg shadow-lg p-4 mb-8 flex justify-between items-center w-3/4 mx-auto ${isStartOfJourney ? '': isEndOfJourney ? '' : ''
              }`}
          >
            <div>
              <h2 className={`text-2xl font-bold mb-2 ${place.isdayend === 1 ? 'text-yellow-700' : place.isdayend === 2 ? 'text-blue-700' : 'text-blue-700'}`}>
                {isStartOfJourney ? `Start journey from ${city}` : place.name}
                {place.isdayend === 1 && " (Lunch Break)"}
                {place.isdayend === 2 && " (Dinner & Lodging)"}
              </h2>
              <p className="text-gray-600 mb-1">{place.types.join(', ')}</p>
              <div className="flex items-center space-x-4 mb-2">
                <span className="bg-yellow-300 text-black px-3 py-1 rounded-full">
                  Visit Duration: {visitDuration} hrs
                </span>
                <span className="text-gray-700 font-semibold">Rating: {place.rating || 'N/A'}</span>
              </div>
            </div>
            {place.photo_reference && (
              <img
                src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=${place.photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`}
                alt={place.name}
                className="w-32 h-24 rounded-lg object-cover ml-4"
              />
            )}
          </div>
        );

        return (
          <div key={place.placeId}>
            {details}
            {/* Dynamic Day End and Next Day */}
            {showDayEnd && (
              <>
                <div className="bg-blue-100 border-l-4 w-3/4 mx-auto border-blue-500 text-blue-700 p-4 mb-8 shadow-lg rounded-md">
                  <h3 className="text-lg font-bold">Day End - Dinner & Overnight Stay</h3>
                </div>
                {/* Increment Day Count */}
                <hr className="my-4 border-blue-300" />
                <div className="text-center py-4 mb-4">
                  <h3 className="text-3xl font-bold text-blue-800">Next Day - Day {++dayCount}</h3>
                </div>
              </>
            )}
            {/* Travel Indicator */}
            {index < final_routes.length - 1 && (
              <div className="flex items-center justify-center my-6">
                <hr className="w-1/2 border-gray-300" />
                <FaBusAlt className="text-2xl text-blue-500 mx-4" />
                <span className="text-gray-700 font-semibold">{Math.round(travelDuration)} mins travel | {travelDistance.toFixed(2)} km</span>
                <hr className="w-1/2 border-gray-300" />
              </div>
            )}
          </div>
        );
      })}

      {/* Final Thank You Message */}
      <div className="text-center mt-8 p-4 bg-green-200 border-t-4 border-green-500 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-green-800">Thank You for Using Our Journey Planner!</h2>
        <p className="text-gray-700 mt-2">We hope you have a wonderful trip.</p>
      </div>
    </div>
  );
};

export default JourneyDetails;
