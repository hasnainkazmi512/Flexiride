import connectDB from '../../../middleware/mongo'; 
import CustomRequest from '../../../models/CustomRequest';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    const token = req.headers['auth-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    const { requestId, bidId } = req.body;

    // Verify the requesting user owns the request
    const request = await CustomRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (request.user.toString() !== decoded.UserID) {
      return res.status(403).json({ error: 'Not authorized to modify this request' });
    }

    // Update the accepted bid
    const updateResult = await CustomRequest.updateOne(
      { _id: requestId, 'bids._id': bidId },
      { 
        $set: { 
          'bids.$.status': 'accepted',
          status: 'accepted'
        } 
      }
    );

    // Reject all other bids
    await CustomRequest.updateOne(
      { _id: requestId },
      { 
        $set: { 
          'bids.$[elem].status': 'rejected' 
        } 
      },
      { 
        arrayFilters: [{ 'elem._id': { $ne: bidId } }] 
      }
    );

    console.log(`Bid ${bidId} accepted for request ${requestId}`);
    return res.status(200).json({ 
      success: true,
      message: 'Bid accepted successfully'
    });

  } catch (error) {
    console.error('Accept Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: error.stack 
    });
  }
}