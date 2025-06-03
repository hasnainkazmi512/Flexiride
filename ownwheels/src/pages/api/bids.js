import connectDB from "../../../middleware/mongo";
import CustomRequest from "../../../models/CustomRequest";
import jwt from 'jsonwebtoken';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const token = req.headers['auth-token'];
      if (!token) return res.status(401).json({ error: "Unauthorized" });
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const providerId = decoded.UserID;

      const { requestId, amount, message, carDetails } = req.body;
      
      const updatedRequest = await CustomRequest.findByIdAndUpdate(
        requestId,
        { $push: { bids: { provider: providerId, amount, message, carDetails } } },
        { new: true }
      ).populate('bids.provider', 'name email');

      res.status(201).json({ success: true, request: updatedRequest });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const token = req.headers['auth-token'];
      if (!token) return res.status(401).json({ error: "Unauthorized" });
      
      const { requestId, bidId, action } = req.body;
      
      const update = action === 'accept' 
        ? { 
            $set: { 
              'bids.$[bid].status': 'accepted',
              status: 'accepted'
            } 
          } 
        : { 
            $set: { 
              'bids.$[bid].status': 'rejected'
            } 
          };

      const updatedRequest = await CustomRequest.findOneAndUpdate(
        { _id: requestId },
        update,
        { 
          arrayFilters: [{ 'bid._id': bidId }],
          new: true
        }
      ).populate('bids.provider', 'name email');

      res.status(200).json({ success: true, request: updatedRequest });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default connectDB(handler);