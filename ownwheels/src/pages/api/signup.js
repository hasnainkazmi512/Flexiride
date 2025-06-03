import User from "../../../models/User";
import connectDB from "../../../middleware/mongo";
import CryptoJS from "crypto-js";


const handler = async (req,res)=>{
    if (req.method == 'POST'){
        try{
            const {name,email,CNIC,image} = req.body
        const userType = req.body.UserType ? req.body.UserType.toLowerCase() : "user";
        let new_user = new User({name:name.toLowerCase(),email:email.toLowerCase(),CNIC:CNIC,password:CryptoJS.AES.encrypt(req.body.password,process.env.JWT_SECRET).toString(),UserType:userType.toLowerCase(),phone_number:req.body.phone_number,image:image})
        
        await new_user.save()

        res.status(200).json({success:"Hurray! You have successfully singed up!"})
        }
        catch (error) {
            res.status(500).json({ error: 'Internal server error' });
          }
    }
    else {
        res.status(400).json({error:"Internal Server Error!"})
    }
}

export default connectDB(handler)