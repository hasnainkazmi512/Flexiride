import Rent from "../../../models/Rent";
import connectDB from "../../../middleware/mongo";
import jwt from "jsonwebtoken";

// Handler function for update and delete requests
const handler = async (req, res) => {
  const token = req.headers["auth-token"];
  const userType = req.headers["user-type"];
  if (!token) return res.status(401).json({ error: "Access Denied, token missing" });

  // Verify the token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: "Invalid Token" });
  }

  // Extract the user ID from the token
  const userId = decoded.UserID;

  if (req.method === "PUT") {
    // Update a Rent record
    try {
      const { rentId } = req.body;
      console.log(rentId)
      // Find and update the rent entry if the user is the owner of the rent record
      let updatedRent
      if (userType == 1){
        updatedRent = await Rent.findOneAndUpdate(
            { _id: rentId},
            { $set: req.body }, // Update fields as provided in the request body
            { new: true, runValidators: true }
          );
      }
      else{
        updatedRent = await Rent.findOneAndUpdate(
            { _id: rentId, userID: userId },
            { $set: req.body }, // Update fields as provided in the request body
            { new: true, runValidators: true }
          );
      }

      if (!updatedRent) {
        return res.status(409).json({ error: "Rent record not found or unauthorized access" });
      }

      res.status(200).json({ success: true, rent: updatedRent });
    } catch (error) {
      console.error("Error updating rent record:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    // Delete a Rent record
    try {
      const { rentId } = req.body;
    if(userType ==1 ){
        deletedRent = await Rent.findOneAndDelete({ _id: rentId});
    }
    else{
        deletedRent = await Rent.findOneAndDelete({ _id: rentId, userID: userId });
    }

      if (!deletedRent) {
        return res.status(404).json({ error: "Rent record not found or unauthorized access" });
      }

      res.status(200).json({ success: true, message: "Rent record deleted successfully" });
    } catch (error) {
      console.error("Error deleting rent record:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

// Export the handler with the MongoDB connection middleware
export default connectDB(handler);
