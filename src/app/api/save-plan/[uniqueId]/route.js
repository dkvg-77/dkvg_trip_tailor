import connectDB from '../../../utils/db';
import User from '../../../models/User';
import Plan from '../../../models/Plan';
import { NextResponse } from 'next/server';

// Named export for POST requests
export async function POST(request, { params }) {
  console.log("HELLO");

  try {
    await connectDB();

    const { uniqueId } = params;
    const { user } = await request.json(); // Parse JSON body

    if (!user || !user.username) {
      return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
    }

    // Find the existing user by username
    const existingUser = await User.findOne({ username: user.username }).populate('saved_plans.plan_id');

    // Ensure the user is found
    if (!existingUser) {
     console.log("user not found");
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if the plan is already saved
    const isSaved = existingUser.saved_plans.some((plan) => plan.plan_id._id.toString() === uniqueId);

    if (isSaved) {
     console.log("plans already saved");

      return NextResponse.json({ message: 'Plan is already saved' }, { status: 200 });
    }

    // Find the plan to save
    const plan = await Plan.findOne({ unique_id: uniqueId });
    if (!plan) {
     console.log("plan not found");

      return NextResponse.json({ message: 'Plan not found' }, { status: 404 });
    }

    // Save the plan to the user's saved plans
    existingUser.saved_plans.push({ plan_id: plan._id, plan_name: plan.city }); // Adjusted to use `plan.city` as the name
    await existingUser.save();

    return NextResponse.json({ message: 'Plan saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving plan:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
