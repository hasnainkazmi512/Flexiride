import mongoose  from "mongoose";


const OrderSchema = new mongoose.Schema({
    userID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
      },
    productID:{type:String,required:true},
    StartDate:{ type: Date, default: Date.now,required:true },
    EndDate:{ type: Date, default: Date.now,required:true },
    Status:{type:String,default:"Pending"},
    user_phonenumber:{type:Number,required:true},
    type:{type:Number,required:true},
    money_status:{type:String,default:"Pending"},
    order_type:{type:Number,default:1,required:true}
},{timestamp:true})

mongoose.models = {}

export default mongoose.model("MakeOrder",OrderSchema)
