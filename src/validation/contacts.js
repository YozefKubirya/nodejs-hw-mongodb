import Joi from "joi";
import { contactTypeList } from "../constants/contacts.js";
export const contactAddSchema = Joi.object({
   name:Joi.string().min(3).max(20).required(),
   phoneNumber:Joi.string().min(3).max(20).required(),
   email:Joi.string().min(3).max(20),
   isFavourite:Joi.boolean(),
   contactType:Joi.string().min(3).max(20).valid(...contactTypeList).required(),
});
export const contactUpdateSchema = Joi.object({
   name:Joi.string(),
   phoneNumber:Joi.string(),
   email:Joi.string(),
   isFavourite:Joi.boolean(),
   contactType:Joi.string().valid(...contactTypeList),
});
