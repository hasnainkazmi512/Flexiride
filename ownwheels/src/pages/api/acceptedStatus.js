import connectDB from "../../../middleware/mongo";
import jwt from "jsonwebtoken";
import MakeOrder from "../../../models/MakeOrder"; 
import User from "../../../models/User";    // Assuming you have a User model to validate the JWT


const handler = async (req, res) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const authHeader = req.headers['auth-token'];
  if (!authHeader) {
      return res.status(401).json({ message: 'Authorization token is missing' });
  }
  console.log(req.body.status)
  const secretKey = process.env.JWT_SECRET;
  const decoded = jwt.verify(authHeader, secretKey);
  const uID = decoded.UserID
  const { _id } = req.query;

  try {
    // Check if the user exists
    const user = await User.findById({_id:uID}); // Assuming the token contains userId
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the order by ID
    console.log(_id)
    const order = await MakeOrder.findById(_id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    console.log(req.body.status)
    order.Status = req.body.status;
    order.order_type= req.body.order_type;
    await order.save();

    return res.status(200).json({ success:true });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export default connectDB(handler);
