// src/app/api/register/route.js
import bcrypt from 'bcrypt';
import User from '../../models/User';
import { connectDB } from '../../lib/dbConnect';

export async function POST(req) {
  await connectDB(); // Connect to MongoDB
  const { username, password } = await req.json(); // Use username instead of name

  // Check if the username already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return new Response(JSON.stringify({ error: 'Username already exists' }), { status: 400 });
  }

  // Hash the password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  try {
    const newUser = new User({ username, passwordHash, saved_plans: [] }); // Save username and hashed password
    await newUser.save();

    return new Response(JSON.stringify({ message: 'User registered successfully' }), { status: 201 });
  } catch (error) {
    console.error('Error registering user:', error);
    return new Response(JSON.stringify({ error: 'Failed to register user' }), { status: 500 });
  }
}
