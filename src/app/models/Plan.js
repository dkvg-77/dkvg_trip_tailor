import mongoose from 'mongoose';

// Main schema for the plan
const planSchema = new mongoose.Schema({
  unique_id: { type: String, unique: true, required: true },
  city:{type:String, required:true},
  final_routes: [ {  // Array of places in the final optimized route
    placeId: { type: String, required: true },
    types: { type: [String], default: [] },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    rating: { type: Number, default: null },
    name: { type: String, default: null },
    photo_reference: { type: String, default: null },
    isdayend: { type: Number, default: 0 }  // 0 for no special day end, 1 for lunch break, 2 for dinner & lodging
  }],
  final_durations: [ {  // Array of durations between adjacent places
    duration: { type: Number, required: true },  // Duration in minutes
    distance: { type: Number, required: true }   // Distance in meters
  }],

});

export default mongoose.models.Plan || mongoose.model('Plan', planSchema);
