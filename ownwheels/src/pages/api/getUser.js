import connectDB from "../../../middleware/mongo";
import User from "../../../models/User";
import jwt from "jsonwebtoken";


const handler = async (req, res)=> {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    const token = req.headers['auth-token'];
  
    if (!token) {
      return res.status(401).json({ message: 'No auth token provided' });
    }
  
    // 2. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  
    // 3. Extract email from query parameters or request body
    const { UserEmail } = decoded
  
    if (!UserEmail) {
      return res.status(400).json({ message: 'Email is required' });
    }
    try {
        if (req.headers['user'] == 'all'){
            const user = await User.find();
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
              }
              return res.status(200).json(user);
        }
      else{
        const user = await User.findOne({email: UserEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
          return res.status(200).json(user);
      }
      
      
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  }

  export default connectDB(handler);