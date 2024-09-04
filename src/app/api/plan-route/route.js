import axios from 'axios';

import { NextResponse } from 'next/server';


const GOOGLE_DIRECTIONS_API = "https://maps.googleapis.com/maps/api/directions/json";
const GOOGLE_NEARBY_PLACES_API = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

const GOOGLE_PLACES_DETAILS_API = "https://maps.googleapis.com/maps/api/place/details/json";

const getPlaceInfo = async (placeId) => {
  const response = await axios.get(GOOGLE_PLACES_DETAILS_API, {
    params: {
      place_id: placeId,
      key: process.env.GOOGLE_API_KEY,
    },
  });

  const place = response.data.result;

  return {
    placeId: placeId,
    types: place?.types || [],
    lat: place.geometry.location.lat,
    lng: place.geometry.location.lng,
    rating: place.rating || null,
    name: place.name || null,
    photo_reference: place.photos ? place.photos[0].photo_reference : null,
    isdayend: 0,
  };
}



const getPlaceIdFromCoordinates = async (lat, lng) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        latlng: `${lat},${lng}`,
        key: process.env.GOOGLE_API_KEY,
      },
    });
    const place = response.data.results[0].place_id;
    return place;
  } catch (error) {
    console.error(`Error fetching place_id for coordinates (${lat}, ${lng}):`, error);
    return null;
  }
};

const getPlaceIdInfoFromCoordinates = async (lat, lng) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        latlng: `${lat},${lng}`,
        key: process.env.GOOGLE_API_KEY,
      },
    });
    const place = response.data.results[0];
    return {
      placeId: place.place_id,
      types: place.types || [],
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
    };
  } catch (error) {
    console.error(`Error fetching place_id for coordinates (${lat}, ${lng}):`, error);
    return null;
  }
};


// Function to calculate the visit time based on place type
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

// Function to find nearby places (restaurants or lodges)
const findNearbyPlace = async (location, type, minPrice, maxPrice) => {
  let radius = 500; // Start with 500 meters
  let result = null;

  while (!result && radius <= 50000) { // Increment radius if no results found
    try {
      const response = await axios.get(GOOGLE_NEARBY_PLACES_API, {
        params: {
          location,
          radius,
          type,
          minprice: minPrice,
          maxprice: maxPrice,
          key: process.env.GOOGLE_API_KEY,
        },
      });

      const places = response.data.results;
      if (places.length > 0) {
        result = places[0]; // Select the first place found
        return result;
      } else {
        radius *= 2; // Increase the search radius
      }
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      break; // Break loop on error to avoid infinite loop
    }
  }


};



// Function to traverse the optimized route and manage breaks
const manageRouteWithBreaks = async (optimized_route_places, adjacent_duration_array) => {
  const copy_optimized_route_places = [...optimized_route_places];
  let duration_count = 0;
  let flag = 0;
  let extra_count = 1;
  for (let i = 1; i < optimized_route_places.length; i++) {

    const place = optimized_route_places[i];
    const visitDuration = getVisitDuration(place.types);

    // Add travel time and visit duration to the total duration count
    duration_count += await adjacent_duration_array[i - 1].duration;
    duration_count += visitDuration * 60; // Convert visit duration from hours to minutes

    const location = `${place.lat},${place.lng}`;

    if (flag === 0 && duration_count > 300) { // 300 minutes = 5 hours
      // Find a nearby restaurant
      // console.log(location);
      const nearbyRestaurant = await findNearbyPlace(location, 'restaurant', 2, 4);
      if (nearbyRestaurant) {
        // Insert the restaurant into the route and reset duration count

        const nearbyRestaurantInfo = await getPlaceInfo(nearbyRestaurant.place_id)
        nearbyRestaurantInfo.isdayend = 1;

        copy_optimized_route_places.splice(i + extra_count, 0, nearbyRestaurantInfo);
        flag = 1;
        duration_count = 0;
        extra_count++;
      }
    } else if (flag === 1 && duration_count > 300) {
      // console.log(location);
      const nearbyLodge = await findNearbyPlace(location, 'lodging', 2, 4);
      if (nearbyLodge) {
        const nearbyLodgeInfo = await getPlaceInfo(nearbyLodge.place_id)
        nearbyLodgeInfo.isdayend = 2;
        copy_optimized_route_places.splice(i + extra_count, 0, nearbyLodgeInfo);

        flag = 0;
        duration_count = 0;
        extra_count++;
      }
    }
  }

  return copy_optimized_route_places;
};


const generate_optimized_route = async (latitude, longitude, placeIds, priceRange, need_optimize) => {

  // console.log(placeIds);
  const origin = `${latitude},${longitude}`;
  const destination = `${latitude},${longitude}`;

  var formattedWaypoints = placeIds.map(id => `place_id:${id}`).join('|');
  if (need_optimize) {
    formattedWaypoints = `optimize:true|${formattedWaypoints}`;

  }
  // console.log(origin);
  // console.log(destination);
  // console.log(formattedWaypointsWithOptimized);
  // Get the main route from Google Directions API
  const directionsResponse = await axios.get(GOOGLE_DIRECTIONS_API, {
    params: {
      origin: `${latitude},${longitude}`,  // Starting coordinates
      destination: `${latitude},${longitude}`,  // Ending coordinates
      waypoints: formattedWaypoints,  // Your pipe-separated place IDs
      key: process.env.GOOGLE_API_KEY,  // Your API key
    },
  });

  const route = directionsResponse.data.routes[0];
  const waypointsOrder = route.waypoint_order;
  // console.log(waypointsOrder);
  const legs = route.legs;


  let optimized_route_places = [];
  let adjacent_duration_array = [];
  const startplaceId = await getPlaceIdFromCoordinates(latitude, longitude)
  const startplaceInfo = await getPlaceInfo(startplaceId);
  optimized_route_places.push(startplaceInfo);

  // Fetch and add the waypoints in the optimized order
  for (let i = 0; i < waypointsOrder.length; i++) {
    const placeInfo = await getPlaceInfo(placeIds[waypointsOrder[i]]);
    optimized_route_places.push(placeInfo);

    // Calculate duration between this waypoint and the previous one
    if (i >= 0) {
      adjacent_duration_array.push({
        duration: legs[i].duration.value,
        distance: legs[i].distance.value
      }
      )
    }
  }

  const endplaceId = await getPlaceIdFromCoordinates(latitude, longitude)
  const endplaceInfo = await getPlaceInfo(endplaceId);
  optimized_route_places.push(endplaceInfo);
  adjacent_duration_array.push({
    duration: legs[adjacent_duration_array.length].duration.value,
    distance: legs[adjacent_duration_array.length].distance.value
  })

  console.log("This below is the optimized_route_places in the funtion -> ")
  console.log(optimized_route_places, adjacent_duration_array);

  return { optimized_route_places, adjacent_duration_array }

}

// Main handler function
export async function POST(req, res) {
  try {
    const { latitude, longitude, placeIds, priceRange } = await req.json();
    const startplaceId = await getPlaceIdFromCoordinates(latitude, longitude)
    var { optimized_route_places, adjacent_duration_array } = await generate_optimized_route(latitude, longitude, placeIds, priceRange, true);

    const optimized_route_places_2 = await manageRouteWithBreaks(optimized_route_places, adjacent_duration_array);
    // console.log("The final optimized_route_places_2 is down below")
    // console.log(optimized_route_places_2);
    const placeIds2 = [];
    for (let i = 0; i < optimized_route_places_2.length; i++) {
      if (optimized_route_places_2[i].placeId === startplaceId) {
        continue;
      }
      placeIds2.push(optimized_route_places_2[i].placeId);
    }
    // console.log(placeIds2);
    var { optimized_route_places, adjacent_duration_array } = await generate_optimized_route(latitude, longitude, placeIds2, priceRange, false);
    const final_optimized_route = optimized_route_places
    const final_adjacent_duration = adjacent_duration_array

    for (let i = 0; i < optimized_route_places_2.length; i++) {
      final_optimized_route[i].isdayend = optimized_route_places_2[i].isdayend;
    }

    console.log("THis below is console log in main_function")
    console.log(final_optimized_route, final_adjacent_duration);

    return NextResponse.json({ final_route: final_optimized_route, final_durations: final_adjacent_duration });
  } catch (error) {
    console.error('Error generating route:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate the route' }), { status: 500 });

  }
}
