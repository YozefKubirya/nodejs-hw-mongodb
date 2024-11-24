import { Schema,model } from "mongoose";
import { handleError } from "./hooks.js";
import { contactTypeList } from "../../constants/contacts.js";


const contactSchema = new Schema({
   name:{
      type:String,
      required:true,
   },

   phoneNumber:{
      type:String,
      required:true,
   },
   email:{
      type:String,

   },
   isFavourite:{
      type:Boolean,
      default:false,
   },
   contactType:{
      type:String,
      enum:contactTypeList,
      required:true,
      default:'personal'
   },
   photo:{
      type : String,
   },
   userId:{
      type: Schema.Types.ObjectId,
      ref:"User",
      required: true,
   },


},{
   versionKey:false,
   timestamps: true, // Додає поля createdAt та updatedAt,
 });
contactSchema.post('save',handleError);

export const sortByList = ["name"];

const ContactsCollection = model("Contact",contactSchema,"Contacts");
export default ContactsCollection;
