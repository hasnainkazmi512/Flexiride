import connectDB from "../../../middleware/mongo";
import jwt from 'jsonwebtoken';
import Deals from "../../../models/Deals";

const handler = async (req, res)=> {
  if (req.method === 'GET') {
    console.log(req.headers['auth-token'])
        const authHeader = req.headers['auth-token'];
        const option = req.headers['options']
        if (!authHeader) {
          return res.status(401).json({ message: 'Authorization header missing' });
        }
        if (option == "all"){
          let all_quotation = await Deals.find()
          console.log(all_quotation)
          res.status(200).json({success:true,
            all_quotation
        })
        }
        
        
        //console.log(authHeader)
        const secretKey = process.env.JWT_SECRET; 
        //console.log(secretKey)
        const decoded = jwt.verify(authHeader, secretKey);
        const userID = decoded.UserID;
        let deal=await Deals.find({userID: userID})
        res.status(200).json({success:true,
            deal
        })
    }
    else{
        res.status(400).json({error:"authorization token does not exist!"})
    }
}

export default connectDB(handler);