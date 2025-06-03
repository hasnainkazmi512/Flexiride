import mongoose  from "mongoose";


const CustomizeSchema = new mongoose.Schema({
    userID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
      },
    UserName:{type:String,default:"User",required:true},
    title:{type:String,required:true},
    desc:{type:String,required:true},
    driver: {type:String, required:true},
    special_instruction:{type:String, required:true},
    phone_number:{type:Number,required:true},
    price:{type:String,default:"Pending", required:true},
},{timestamp:true})

mongoose.models = {}

export default mongoose.model("CustomizeQuotation",CustomizeSchema)
