import connectDB from "../../../middleware/mongo";
import Rent from "../../../models/Rent";
import User from "../../../models/User";
import jwt from 'jsonwebtoken';

const handler = async(req,res)=>{
    if (req.method == "POST"){
        console.log(req.body)
        const authHeader = req.headers['auth-token'];
        const secretKey = process.env.JWT_SECRET; 
        //console.log(secretKey)
        const decoded = jwt.verify(authHeader, secretKey);
        console.log(decoded)
        const uID = decoded.UserID;
        var user = await User.find({_id:uID})
        const {Color,mileage,car_make,car_name,reg_plate,fare,images,transmission,driver_status} = req.body
        const UserName= user[0].name
        console.log(UserName)
        let rentAd = new Rent({userID:uID,Color,mileage,car_make,car_name,reg_plate,UserName,fare,images,transmission,driver_status})

        await rentAd.save() 
        res.status(200).json({success:true})
    }
    else{
        res.status(400).json({error:"Invalid Ad"})
    }
}

export default connectDB(handler);