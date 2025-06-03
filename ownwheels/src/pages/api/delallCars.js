import connectDB from "../../../middleware/mongo";
import Rent from "../../../models/Rent"; // Assuming Rent model corresponds to rents data
import MakeOrder from "../../../models/MakeOrder";
import jwt from "jsonwebtoken";
import User from "../../../models/User";
import Deals from "../../../models/Deals";

const handler = async (req, res) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers["auth-token"];
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization token is missing" });
  }

  const { _id } = req.query;
  console.log("id",_id)
  const secretKey = process.env.JWT_SECRET;
  try {
    const decoded = jwt.verify(authHeader, secretKey);
    const userID = decoded.UserID;
    console.log(userID)
    if (userID){
        try{
        const rent = await Rent.findOneAndDelete(_id);
        console.log(rent)
        if(!rent){
           const deals = await Deals.findOneAndDelete(_id);
           console.log(deals)
           return res.status(500).json({ DealsSuccess:true });
        }
        return res.status(500).json({ rentSuccess:true });
    }
    catch{
        return res.status(500).json({ error: "Internal server error here " });
    }
        
    }

    
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).json({ error: "Internal server error there " });
  }
};

export default connectDB(handler);
