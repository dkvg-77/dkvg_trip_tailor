// src/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, 
  passwordHash: { type: String, required: true },
  saved_plans: [{
    plan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
    plan_name: { type: String, required: true },
  }]
});

export default mongoose.models.User || mongoose.model('User', userSchema);
