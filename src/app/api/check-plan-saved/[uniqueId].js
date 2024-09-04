// src/app/api/check-plan-saved/[uniqueId]/route.js

import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { uniqueId } = req.query;
    const { user } = req.body; // `user` should be passed from the frontend

    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const existingUser = await User.findById(user._id).populate('saved_plans.plan_id');

    const isSaved = existingUser.saved_plans.some((plan) => plan.plan_id._id.toString() === uniqueId);

    return res.status(200).json({ isSaved });
  } catch (error) {
    console.error('Error checking plan:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
