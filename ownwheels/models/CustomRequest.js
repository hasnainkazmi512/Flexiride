import mongoose from 'mongoose';

const CustomRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  budget: { type: Number, required: true },
  description: { type: String, required: true },
  preferredDates: { type: [Date] },
  location: { type: String },
  status: { type: String, enum: ['open', 'closed', 'accepted'], default: 'open' },
  bids: [{
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number },
    message: { type: String },
    carDetails: { type: String },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.CustomRequest || mongoose.model('CustomRequest', CustomRequestSchema);