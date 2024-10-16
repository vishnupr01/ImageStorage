import mongoose,{Document} from "mongoose";

export default interface IUser extends Document{
  name:string,
  email:string,
  password:string,
  number:number

}