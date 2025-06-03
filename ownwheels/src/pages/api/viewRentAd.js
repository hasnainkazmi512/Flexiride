import connectDB from "../../../middleware/mongo";
import Rent from "../../../models/Rent";

import jwt from 'jsonwebtoken';

const handler = async (req, res)=> {
  if (req.method === 'GET') {
        const authHeader = req.headers['auth-token'];
        const option = req.headers['options']
        console.log(authHeader)
        if (option == "all"){
          let all_ads = await Rent.find()
          console.log("ALl adds id",all_ads[0]._id)
          res.status(200).json({success:true,
            data:all_ads
        })
        }
        
        if (!authHeader) {
          return res.status(401).json({ message: 'Authorization header missing' });
        }
        //console.log(authHeader)
        const secretKey = process.env.JWT_SECRET; 
        //console.log(secretKey)
        const decoded = jwt.verify(authHeader, secretKey);
        const userID = decoded.UserID;
        let ads =await Rent.find({userID: userID})
        res.status(200).json({success:true,
            ads
        })
    }
    else{
        res.status(400).json({error:"authorization token does not exist!"})
    }
}

export default connectDB(handler);