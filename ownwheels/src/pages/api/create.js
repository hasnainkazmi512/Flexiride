import connectDB from '../../../middleware/mongo';
import CustomRequest from '../../../models/CustomRequest';
import jwt from 'jsonwebtoken';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.headers['auth-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.UserID;

    const { budget, description, location, preferredDates } = req.body;
    
    if (!budget || !description) {
      return res.status(400).json({ error: 'Budget and description are required' });
    }

    // Handle preferredDates safely
    let datesArray = [];
    if (preferredDates) {
      datesArray = typeof preferredDates === 'string' 
        ? preferredDates.split(',').map(date => date.trim())
        : preferredDates;
    }

    const newRequest = new CustomRequest({
      user: userId,
      budget: Number(budget),
      description,
      location: location || '',
      preferredDates: datesArray,
      status: 'open',
      bids: []
    });

    const savedRequest = await newRequest.save();

    return res.status(201).json({ 
      success: true,
      message: 'Custom request created successfully',
      request: savedRequest
    });

  } catch (error) {
    console.error('Create Request Error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.message.includes('buffering timed out')) {
      return res.status(500).json({ error: 'Database operation timed out' });
    }
    return res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default connectDB(handler);