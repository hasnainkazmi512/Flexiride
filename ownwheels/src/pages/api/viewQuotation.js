import connectDB from "../../../middleware/mongo";
import CustomizeQuotation from "../../../models/CustomizeQuotation";

import jwt from 'jsonwebtoken';

const handler = async (req, res)=> {
  if (req.method === 'GET') {
        const authHeader = req.headers['auth-token'];
        const option = req.headers['options']
        if (option == "all"){
          let all_quotation = await CustomizeQuotation.find()
          res.status(200).json({success:true,
            all_quotation
        })
        }
        
        if (!authHeader) {
          return res.status(401).json({ message: 'Authorization header missing' });
        }
        //console.log(authHeader)
        const secretKey = process.env.JWT_SECRET; 
        //console.log(secretKey)
        const decoded = jwt.verify(authHeader, secretKey);
        console.log(decoded)
        const userID = decoded.UserID;
        console.log(userID)
        let quotations =await CustomizeQuotation.find({userID: userID})
        res.status(200).json({success:true,
            quotations
        })
    }
    else{
        res.status(400).json({error:"authorization token does not exist!"})
    }
}

export default connectDB(handler);