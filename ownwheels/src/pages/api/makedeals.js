import connectDB from "../../../middleware/mongo";
import Deals from "../../../models/Deals"; 
import User from "../../../models/User";
import jwt from "jsonwebtoken";


const handler = async(req,res)=>{
    if (req.method == "POST"){
        console.log(req.body)
        const authHeader = req.headers['auth-token'];
        const secretKey = process.env.JWT_SECRET; 
        //console.log(secretKey)
        var driver = false;
        if (req.body.driver ==='Available'){
            driver = true
        }
        else if (req.body.driver ==='Not-Available'){
            driver = false
        }
        console.log("driver",driver)
        const decoded = jwt.verify(authHeader, secretKey);
        console.log(decoded)
        const uID = decoded.UserID;
        var user = await User.find({_id:uID})
        const {title,desc,special_instruction,price,images,type_deal} = req.body
        const UserName= user[0].name
        const UserPhoneNumber = user[0].phone_number
        let deal = new Deals({userID:uID,title,desc,special_instruction,driver,UserPhoneNumber,price,UserName,images,type_deal})
        await deal.save() 
        res.status(200).json({success:"Deal is Booked!"})
    }
    else{
        res.status(400).json({error:"Internal Server Error!"})
    }
}

export default connectDB(handler);