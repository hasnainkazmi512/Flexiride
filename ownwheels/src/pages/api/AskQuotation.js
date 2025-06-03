import connectDB from "../../../middleware/mongo";
import CustomizeQuotation from "../../../models/CustomizeQuotation";
import User from "../../../models/User";
import jwt from 'jsonwebtoken';

const handler = async(req,res)=>{
    if (req.method == "POST"){
        const authHeader = req.headers['auth-token'];
        const secretKey = process.env.JWT_SECRET; 
        //console.log(secretKey)
        const decoded = jwt.verify(authHeader, secretKey);
        console.log(decoded)
        const uID = decoded.UserID;
        var user = await User.find({_id:uID})
        const {userID,title,desc,special_instruction,phone_number,price} = req.body
        const UserName= user[0].name
        let quotation = new CustomizeQuotation({userID,title,desc,special_instruction,phone_number,price,UserName})
        await quotation.save() 
        res.status(200).json({success:"Your Quotation is sent!"})
    }
    else{
        res.status(400).json({error:"Internal Server Error!"})
    }
}

export default connectDB(handler);