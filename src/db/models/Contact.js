import { Schema,model } from "mongoose";
const contactSchema= new Schema({
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
      enum:["personal","home",'work'],
      required:true,
      default:'personal'
   },

},{
   versionKey:false,
   timestamps: true, // Додає поля createdAt та updatedAt,
 });

const ContactsCollection=model("Contact",contactSchema,"Contacts");
export default ContactsCollection;
