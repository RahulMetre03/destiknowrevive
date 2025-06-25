import mongoose, { Mongoose } from "mongoose";

const userSchema = new mongoose.Schema({
    username : String , 
    email : String ,
    phone : Number , 
    password : String , 
    city : String

});

export const User = mongoose.model('User' , userSchema);