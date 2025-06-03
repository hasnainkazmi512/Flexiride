import mongoose  from "mongoose";


const DealSchema = new mongoose.Schema({
    userID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
      },
    images:[
          {img1:{type:String,required:true},
          img2:{type:String},
          img3:{type:String}
    }],
    UserName:{type:String,default:"User",required:true},
    UserPhoneNumber:{type:Number,default:123,required:true},
    title:{type:String,required:true},
    desc:{type:String,required:true},
    type_deal:{type:String,requird:true},
    driver: {type:Boolean, required:true},
    special_instruction:{type:String, required:true},
    price:{type:String,default:"N/A", required:true},
},{timestamp:true})

mongoose.models = {}

export default mongoose.model("Deals",DealSchema)
