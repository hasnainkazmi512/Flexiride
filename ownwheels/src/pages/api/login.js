import User from "../../../models/User";
import connectDB from "../../../middleware/mongo";
var CryptoJS = require("crypto-js");
var jwt = require("jsonwebtoken");

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    console.log(req.body);
    
    // Check if email is provided
    if (!req.body.email || !req.body.password || !req.body.UserType) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    let user = await User.findOne({ email: req.body.email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ error: "No user found with this email" });
    }
    
    console.log("User Found:", user);
    
    // Decrypt stored password
    var bytes = CryptoJS.AES.decrypt(user.password, process.env.JWT_SECRET);
    var decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
    
    // Validate credentials
    if (req.body.password !== decryptedPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (req.body.UserType !== user.UserType) {
      return res.status(403).json({ error: "User type mismatch" });
    }

    // Generate JWT Token
    var token = jwt.sign(
      { UserID: user._id, UserEmail: user.email, UserType: user.UserType },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    res.status(200).json({ success: true, token, usertype: user.UserType });
  } catch (error) {
    console.error("Error in login handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default connectDB(handler);
