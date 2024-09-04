// src/app/api/nearby-places/route.js

import axios from 'axios';
import { NextResponse } from 'next/server';

const TYPE_MULTIPLIERS = {
  'tourist_attraction': 6,  // x1
  'amusement_park': 1,      // x2
  'art_gallery': 2,         // x3
  // Add more types as needed...
};

const DAYS_MULTIPLIERS = {
  '1-2 days': 1,   // y
  '3-5 days': 2,
  '6-10 days': 3,
  '11-20 days': 4,
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { latitude, longitude, selectedTypes, daysRange } = body;

    let radius = 45000; // default radius for '1-2 days'

    switch (daysRange) {
      case '1-2 days':
        radius = 45000; // 45 km
        break;
      case '3-5 days':
        radius = 200000; // 200 km
        break;
      case '6-10 days':
        radius = 500000; // 500 km
        break;
      case '11-20 days':
        radius = 1000000; // 1000 km
        break;
      default:
        radius = 45000; // default radius if no match
    }

    if (!latitude || !longitude || !selectedTypes || !daysRange) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Determine the multiplier based on the number of days selected
    const y = DAYS_MULTIPLIERS[daysRange];

    // Prepare an array to store the final places
    let finalPlaces = [];

    // Fetch places for each type using Google Places API
    for (const type of selectedTypes) {
      const maxResults = Math.min(20, (TYPE_MULTIPLIERS[type] || 2) * y);

      const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
        params: {
          location: `${latitude},${longitude}`,
          radius: radius, // Adjust radius as needed
          type,
          key: process.env.GOOGLE_API_KEY,
        },
      });

      const places = response.data.results;


      // Map and extract places with photos fetched using the Places Photos API
      
      const extractedPlaces = places.slice(0, maxResults).map((place) => ({
        place_id: place.place_id,
        types: place.types,
        name: place.name,
        rating: place.rating,
        photo_reference: place.photos ? place.photos[0].photo_reference : null, 
      }));

      // Merge into final results, ensuring uniqueness by place_id
      finalPlaces = [...finalPlaces, ...extractedPlaces].reduce((acc, current) => {
        if (!acc.some(item => item.place_id === current.place_id)) {
          acc.push(current);
        }
        return acc;
      }, []);
    }

    // Return the final list of places
    return NextResponse.json({ places: finalPlaces });
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    return NextResponse.json({ error: 'Failed to fetch nearby places' }, { status: 500 });
  }
}
