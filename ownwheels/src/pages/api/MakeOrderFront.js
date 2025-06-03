import connectDB from "../../../middleware/mongo";
import Deals from "../../../models/Deals"; 
import User from "../../../models/User";
import Rent from "../../../models/Rent";
import CustomizeQuotation from "../../../models/CustomizeQuotation";
import MakeOrder from "../../../models/MakeOrder";
import jwt from 'jsonwebtoken';

const handler = async(req,res)=>{
    if (req.method == "POST"){
        const authHeader = req.headers['auth-token'];
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization token is missing' });
          }
        const secretKey = process.env.JWT_SECRET; 
        //console.log(secretKey)
        const decoded = jwt.verify(authHeader, secretKey);
        console.log(decoded)
        const uID = decoded.UserID;
        console.log(uID)
        var user = await User.find({_id:uID})
        const {productID,StartDate,EndDate,Status,type,order_type} = req.body
        const UserName= user[0].name
        const UserPhoneNumber = user[0].phone_number
        console.log(UserName,UserPhoneNumber)
        let order = new MakeOrder({userID:uID,productID,StartDate,EndDate,Status,user_phonenumber:UserPhoneNumber,UserName,type,order_type})
        await order.save() 
        res.status(200).json({success:true})
    }
    else{
        res.status(400).json({error:"Internal Server Error!"})
    }
}

export default connectDB(handler);