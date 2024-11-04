import * as contactServices from '../services/contacts.js';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
export const getContactsController =async (req,res)=>{
const data = await contactServices.getContacts();
res.json({
status: 200,
message: "Successfully found contacts!",
data,});
};

export const getContactsByIdController=async (req,res)=>{
const {id}=req.params;

if (!mongoose.Types.ObjectId.isValid(id)) {
throw createHttpError(404, 'Contact not found');
}

const data = await contactServices.getContactById(id);

if(!data){
throw createHttpError(404,'Contact not found');
}

res.json({
status: 200,
message: `Successfully found contact with id ${id}!`,
data,});


};

export const addContactController= async(req,res)=>{
const data=await contactServices.addContact(req.body);

res.status(201).json({
status:201,
message:'Successfully created a contact!',
data,});
};

export const updateContactController=async(req,res)=>{
const {id: _id} =req.params;
const result=await contactServices.updateContact({_id,payload:req.body});

if(!result){
throw createHttpError(404,'Contact not found');
};

res.json({
status:200,
message:'Successfully patched a contact!',
data:result,
});};

export const deleteContactController=async(req,res)=>{
const {id: _id}=req.params;
const data =await contactServices.deleteContact({_id});

if(!data){
throw createHttpError(404,'Contact not found');
}

res.status(204).json({
status:204,
data,
message:"Contact is deleted",
});};
