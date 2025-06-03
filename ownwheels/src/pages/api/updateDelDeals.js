import Deal from "../../../models/Deals";
import connectDB from "../../../middleware/mongo";
import jwt from "jsonwebtoken";

// Handler function for update and delete requests
const handler = async (req, res) => {

  // Extract the token from the request header
  const token = req.headers["auth-token"];
  const userType =  req.headers["user-type"]
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
    // Update a Deal record
    try {
      const { dealId } = req.body;
      let updatedDeal
      // Find and update the deal entry if the user is the owner of the deal
      if (userType == 1){
        updatedDeal = await Deal.findOneAndUpdate(
            { _id: dealId},
            { $set: req.body }, // Update fields as provided in the request body
            { new: true, runValidators: true }
          );
    }
    else{
        updatedDeal = await Deal.findOneAndUpdate(
            { _id: dealId, userID: userId },
            { $set: req.body }, // Update fields as provided in the request body
            { new: true, runValidators: true }
          );
    }
      if (!updatedDeal) {
        return res.status(404).json({ error: "Deal record not found or unauthorized access" });
      }

      res.status(200).json({ success: true, deal: updatedDeal });
    } catch (error) {
      console.error("Error updating deal record:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    // Delete a Deal record
    try {
      const { dealId } = req.body;

      // Find and delete the deal entry if the user is the owner
      let deletedDeal
      if(userType == 1){
        deletedDeal = await Deal.findOneAndDelete({ _id: dealId });
      }
      else{
      deletedDeal = await Deal.findOneAndDelete({ _id: dealId, userID: userId });
      }
      if (!deletedDeal) {
        return res.status(404).json({ error: "Deal record not found or unauthorized access" });
      }

      res.status(200).json({ success: true, message: "Deal record deleted successfully" });
    } catch (error) {
      console.error("Error deleting deal record:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

// Export the handler with the MongoDB connection middleware
export default connectDB(handler);
