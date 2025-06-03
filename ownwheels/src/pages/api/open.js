import connectDB from '../../../middleware/mongo';
import CustomRequest from '../../../models/CustomRequest';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      await connectDB();
      
      // Get all open requests (status: 'open')
      const requests = await CustomRequest.find({ status: 'open' })
        .populate('user', 'name email');
        
      res.status(200).json({ success: true, requests });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default handler;