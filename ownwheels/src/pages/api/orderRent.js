import connectDB from "../../../middleware/mongo";
import Rent from "../../../models/Rent"; // Assuming Rent model corresponds to rents data
import MakeOrder from "../../../models/MakeOrder";
import jwt from "jsonwebtoken";
import User from "../../../models/User";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers["auth-token"];
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization token is missing" });
  }

  const secretKey = process.env.JWT_SECRET;
  try {
    const decoded = jwt.verify(authHeader, secretKey);
    const userID = decoded.UserID;

    // Find all rents associated with the logged-in user
    const rents = await Rent.find({ userID });

    if (!rents || rents.length === 0) {
      return res.status(404).json({ message: "No rentals found for this user." });
    }

    // Extract productIDs from rents
    const productIDs = rents.map((rent) => rent._id);

    // Find orders in MakeOrder collection matching these productIDs
    const orders = await MakeOrder.find({ productID: { $in: productIDs } });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for the user’s rentals." });
    }

    // Populate user details for each order
    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        const user = await User.findById(order.userID, "name"); // Fetch user name
        return {
          ...order._doc, // Spread order details
          userName: user ? user.name : "Unknown User", // Add user name or default
        };
      })
    );
    console.log(populatedOrders)
    return res.status(200).json({ success: true, data: { orders: populatedOrders, rents } });
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default connectDB(handler);
