import User from "../../../models/User";
import connectDB from "../../../middleware/mongo";
import jwt from "jsonwebtoken";
import Rent from "../../../models/Rent";
import Deals from "../../../models/Deals";
import CustomizeQuotation from "../../../models/CustomizeQuotation";
import MakeOrder from "../../../models/MakeOrder";
var CryptoJS = require("crypto-js");

const handler = async (req, res) => {
  if (req.method === "PUT") {
    console.log(req.body)
    // Update User
    try {
      // Extract token from the request headers
      const token = req.headers['auth-token'];
      if (!token) return res.status(401).json({ error: "Access Denied" });

      // Verify the token
      
      
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified) return res.status(401).json({ error: "Invalid Token" });

      const userId = verified.UserID;
      
      if (verified.userType == 'admin'){
        const userId = req.body._id
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $set: req.body }, // Update with the provided data
          { new: true, runValidators: true }
        );
        if (!updatedUser) {
          return res.status(404).json({ error: "User not found" });
        }
        res.json({ success: true});
      }
      else{
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: req.body }, // Update with the provided data
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ success: true, updatedUser });}
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    // Delete User
    try {
      // Extract token from the request headers
      const token = req.headers['auth-token'];
      const Admin = req.headers['permission']
      if (Admin == "admin"){
        const {userId} = req.body
        await User.findByIdAndDelete({_id:userId});
        await Rent.deleteMany({ userID: userId });
        await Deals.deleteMany({ userID: userId });
        await CustomizeQuotation.deleteMany({ userID: userId });
        await MakeOrder.deleteMany({ userID: userId });
        res.json({ success: true, message: "User deleted successfully" });
      }
      if (!token) return res.status(401).json({ error: "Access Denied" });

      // Verify the token
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified) return res.status(401).json({ error: "Invalid Token" });

      const userId = verified.UserID;

      // Delete user
      const deletedUser = await User.findByIdAndDelete(userId);
      await Rent.deleteMany({ userID: userId });
      await Deals.deleteMany({ userID: userId });
      await CustomizeQuotation.deleteMany({ userID: userId });
      await MakeOrder.deleteMany({ userID: userId });
      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // Handle other HTTP methods
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default connectDB(handler);
