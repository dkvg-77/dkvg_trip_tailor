import connectDB from '../../../utils/db';
import User from '../../../models/User';
import { NextResponse } from 'next/server';

// Named export for POST requests
export async function POST(request, { params }) {
  try {
    await connectDB();
  
    const { uniqueId } = params;
    const { user } = await request.json(); // Parse JSON body
    

    if (!user || !user.username) {
      console.log("user not Authenticated")
      return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
    }

    // Find the existing user by username
    const existingUser = await User.findOne({ username: user.username }).populate('saved_plans.plan_id');

    // Ensure the user is found
    if (!existingUser) {
      console.log("user not found")

      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if the plan is already saved
    const isSaved = existingUser.saved_plans.some((plan) => plan.plan_id.unique_id === uniqueId);

    if (isSaved) {
      console.log("plan is saved")

      return NextResponse.json({ message: 'Plan is saved', isSaved: true }, { status: 200 });
    } else {
      console.log("plan is not saved")

      return NextResponse.json({ message: 'Plan is not saved', isSaved: false }, { status: 200 });
    }
  } catch (error) {
    console.log( " error checking plan is saved")

    console.error('Error checking if plan is saved:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
