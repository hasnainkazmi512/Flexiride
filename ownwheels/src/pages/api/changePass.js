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
    // Update User
    try {
      // Extract token from the request headers
      const token = req.headers['auth-token'];
      if (!token) return res.status(401).json({ error: "Access Denied" });

      // Verify the token
      
      
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified) return res.status(401).json({ error: "Invalid Token" });

      const userId = verified.UserID;
      if (req.body.newPassword !== null){
        const encrypted_pass = CryptoJS.AES.encrypt(req.body.newPassword,process.env.JWT_SECRET).toString()
        let p_user = await User.findOne({ email: verified.UserEmail.toLowerCase() });
        var bytes = CryptoJS.AES.decrypt(p_user.password, process.env.JWT_SECRET);
        var current_password = bytes.toString(CryptoJS.enc.Utf8);
        if (req.body.customer.password == p_user.password ){
          const updatedpassUser = await User.findByIdAndUpdate(
            userId,
            { $set: req.body.customer,password:encrypted_pass }, // Update with the provided data
            { new: true, runValidators: true }
          );
          res.res.status(200).json({ success: true});
        }
        else{
          res.res.status(404).json({success:false});
        }
      }
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } 
};

export default connectDB(handler);
