import CustomizeQuotation from "../../../models/CustomizeQuotation";
import connectDB from "../../../middleware/mongo";
import jwt from "jsonwebtoken";

// Handler function for update and delete requests
const handler = async (req, res) => {

  // Extract the token from the request header
  const token = req.headers["auth-token"];
  const userType = req.headers["user-type"]
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
    // Update a CustomizeQuotation record
    try {
      const { customizeId } = req.body;
        let updatedCustomize
      // Find and update the customization if the user is the owner of the record
      if (userType == 1){
        updatedCustomize = await CustomizeQuotation.findOneAndUpdate(
            { _id: customizeId},
            { $set: req.body }, // Update fields as provided in the request body
            { new: true, runValidators: true }
          );
      }
      else{
        updatedCustomize = await CustomizeQuotation.findOneAndUpdate(
            { _id: customizeId, userID: userId },
            { $set: req.body }, // Update fields as provided in the request body
            { new: true, runValidators: true }
          );
      }

      if (!updatedCustomize) {
        return res.status(404).json({ error: "CustomizeQuotation record not found or unauthorized access" });
      }

      res.status(200).json({ success: true, customize: updatedCustomize });
    } catch (error) {
      console.error("Error updating CustomizeQuotation record:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    // Delete a CustomizeQuotation record
    try {
      const { customizeId } = req.body;

      // Find and delete the customization if the user is the owner
      let deletedCustomize
      if(userType == 1){
        deletedCustomize = await CustomizeQuotation.findOneAndDelete({
            _id: customizeId,
          });
      }
      else{
        deletedCustomize = await CustomizeQuotation.findOneAndDelete({
            _id: customizeId,
            userID: userId,
          });
      }

      if (!deletedCustomize) {
        return res.status(404).json({ error: "CustomizeQuotation record not found or unauthorized access" });
      }

      res.status(200).json({ success: true, message: "CustomizeQuotation record deleted successfully" });
    } catch (error) {
      console.error("Error deleting CustomizeQuotation record:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

// Export the handler with the MongoDB connection middleware
export default connectDB(handler);
