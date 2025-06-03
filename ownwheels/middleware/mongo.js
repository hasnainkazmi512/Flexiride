import mongoose from "mongoose";

const connectDB = (handler) => async (req, res) => {
  if (mongoose.connections[0].readyState) {
    return handler(req, res);
  }

  try {
    await mongoose.connect(process.env.MONGOURI, {
      serverSelectionTimeoutMS: 40000, // 5 seconds timeout for initial connection
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    console.log("MongoDB connected successfully");
    return handler(req, res);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return res.status(500).json({ 
      error: "Database connection failed",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

export default connectDB;