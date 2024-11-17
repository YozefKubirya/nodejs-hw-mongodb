
import { handleError } from "./hooks.js";
import { Schema,model } from "mongoose";

const sessionSchema = new Schema({
   userId:{
      type: Schema.Types.ObjectId,
      required: true,
   },
   accessToken:{
      type: String,
      required: true,
   },
   refreshToken:{
      type: String,
      required: true,
   },
   accessTokenValidUntil:{
      type: Date,
      required:true,
   },
   refreshTokenValidUntil:{
      type: Date,
      required:true,
   },

},{versionKey:false,timestamps:true,});

sessionSchema.post('save',handleError);

const SessionCollection = model("Session",sessionSchema);
export default SessionCollection;
