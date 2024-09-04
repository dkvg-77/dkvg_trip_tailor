// src/app/api/login/route.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../../models/User';
import { connectDB } from '../../lib/dbConnect';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  await connectDB(); // Connect to MongoDB
  const { username, password } = await req.json();  // Use username instead of userId

  try {
    const user = await User.findOne({ username });  // Query by username
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    // Compare password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.userId, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    return new Response(JSON.stringify({ token, message: 'Login successful' }), { status: 200 });
  } catch (error) {
    console.error('Error during login:', error);
    return new Response(JSON.stringify({ error: 'Login failed' }), { status: 500 });
  }
}
