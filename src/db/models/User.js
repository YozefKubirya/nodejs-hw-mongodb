
import { handleError } from "./hooks.js";
import { Schema,model } from "mongoose";
import { emailRegexp } from "../../constants/users.js";


const userSchema = new Schema({
   name:{
      type: String,
      required: true,
   },
   email:{
      type: String,
      match: emailRegexp,
      unique: true,
      required: true,
   },
   password:{
      type: String,
      required: true,
   }
},
{
   versionKey: false,
   timestamps: true,
});

userSchema.post('save',handleError);

const UserCollection = model("User",userSchema);

export default UserCollection;
