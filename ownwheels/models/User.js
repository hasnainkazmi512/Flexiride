import mongoose  from "mongoose";


const UserSchema = new mongoose.Schema({
    name: {type: String, required:true},
    image:{type:String},
    email:{type:String, required:true},
    CNIC: {type: Number, required:true},
    UserType: {type:String,required:true},
    password: {type:String,required:true},
    phone_number:{type:Number,required:true}
})

UserSchema.set('timestamps',true);

mongoose.models = {}

export default mongoose.model("User",UserSchema)
