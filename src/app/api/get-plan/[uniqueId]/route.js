import { NextResponse } from 'next/server';
import {connectDB} from '../../../lib/dbConnect'; // Make sure the path is correct
import Plan from '../../../models/Plan'; // Import the Plan model

export async function GET(request, { params }) {
  const { uniqueId } = params; // Get the uniqueId from the URL params

  try {
    await connectDB(); // Connect to the database

    // Find the plan by unique_id
    const plan = await Plan.findOne({ unique_id: uniqueId });

    if (!plan) {
      return NextResponse.json({ message: 'Plan not found' }, { status: 404 });
    }

    // Return the plan data
    return NextResponse.json(plan);
  } catch (error) {
    console.error('Error fetching plan:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
