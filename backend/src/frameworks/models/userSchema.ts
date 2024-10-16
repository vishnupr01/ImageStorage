import mongoose from 'mongoose'

const userSchema=new mongoose.Schema({
  email:{
    type:String,
    required:true,
    unique:true

  },
  name:{
    type:String,
    required:true
  },
  password:{
    type:String
  },
  phoneNumber:{
    type:Number,
    required:true
  }
})
export const UserModel=mongoose.model("Users",userSchema)