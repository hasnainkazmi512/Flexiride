import connectDB from "../../../middleware/mongo";
import Rent from "../../../models/Rent"; // Assuming Rent model corresponds to rents data
import MakeOrder from "../../../models/MakeOrder";
import jwt from "jsonwebtoken";
import User from "../../../models/User";
import Deals from "../../../models/Deals";

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
    if (userID){
    // Fetch data from Rent and Deals where productID exists in the list
    const rentData = await MakeOrder.find();
    let rev = 0;
    rentData.forEach(element => {
        console.log(element.price)
    });
    res.status(200).json({
      success: true,
      data: {
        rev
      },
    });}
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default connectDB(handler);
