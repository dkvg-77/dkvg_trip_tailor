import connectDB from '../../utils/db';
import User from '../../models/User';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();

    // Assuming you are passing the username in the headers or via query parameters
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
    }

    // Find the user by username and populate the saved plans
    const user = await User.findOne({ username }).populate('saved_plans.plan_id');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ savedPlans: user.saved_plans }, { status: 200 });
  } catch (error) {
    console.error('Error fetching saved plans:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
