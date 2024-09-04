// src/app/api/find-place/route.js

import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get('input'); // The place name input

  if (!input) {
    return NextResponse.json(
      { error: 'Place name is required as input.' },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json`, 
      {
        params: {
          input: input,
          inputtype: 'textquery',
          fields: 'geometry,name',
          key: process.env.GOOGLE_API_KEY
        }
      }
    );

    const data = response.data;

    if (data.status === 'OK' && data.candidates.length > 0) {
      const location = data.candidates[0].geometry.location;
      const name = data.candidates[0].name;
      const coordinates = `${location.lat},${location.lng}`;
      console.log(coordinates,name);
      return NextResponse.json({ coordinates, name });
    } else {
      return NextResponse.json(
        { error: 'No place found.' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error fetching place information:', error);
    return NextResponse.json(
      { error: 'Failed to fetch place information' },
      { status: 500 }
    );
  }
}
