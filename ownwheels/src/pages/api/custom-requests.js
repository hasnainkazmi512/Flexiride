import connectDB from '../../../middleware/mongo';
import CustomRequest from '../../../models/CustomRequest';
import auth from '../../../middleware/auth';

export default async function handler(req, res) {
  // Apply auth middleware
  await auth(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
      await connectDB();
      const userId = req.user.UserID;

      const requests = await CustomRequest.find({ user: userId })
        .populate('user', 'name email')
        .populate('bids.provider', 'name email phone')
        .lean();

      return res.status(200).json({ success: true, requests });

    } catch (error) {
      console.error('Server error:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Internal server error'
      });
    }
  });
}