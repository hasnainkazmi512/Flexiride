import connectDB from "../../../middleware/mongo";
import Rent from "../../../models/Rent"; // Assuming Rent model corresponds to rents data
import MakeOrder from "../../../models/MakeOrder";
import jwt from "jsonwebtoken";
import User from "../../../models/User";
import Deals from "../../../models/Deals";

const handler = async (req, res) => {
  console.log("object")
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
    const options = req.headers["options"]
    if (options === "all"){
      let all_order = await MakeOrder.find();

    // Extract product IDs from all_order
    const productIDs = all_order.map(order => order.productID);

    // Fetch data from Rent and Deals where productID exists in the list
    const rentData = await Rent.find({ _id: { $in: productIDs } });
    const dealsData = await Deals.find({ _id: { $in: productIDs } });
    console.log("Deals and rents and all order",all_order,rentData,dealsData)
    // Combine all data into one response
    res.status(200).json({
      success: true,
      data: {
        all_order,
        rentData,
        dealsData,
      },
    });
    }
    else if(options === "all_cars"){

    // Fetch data from Rent and Deals where productID exists in the list
    const rentData = await Rent.find();
    console.log()
    const dealsData = await Deals.find();
    // Combine all data into one response
    res.status(200).json({
      success: true,
      data: {
        rentData,
        dealsData,
      },
    });
    }
    // Find all rents associated with the logged-in 
    console.log("User",userID)
    const rents = await Rent.find({ userID });

    console.log("Rents",rents)
    if (!rents || rents.length === 0) {
      console.log(userID)
      return res.status(410).json({ userid: userID,message: "No rentals found for this user." });
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
