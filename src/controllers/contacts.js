import * as contactServices from '../services/contacts.js';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { sortByList } from '../db/models/Contact.js';

export const getContactsController = async (req,res)=>{
   const { id: userId } = req.user;
   const {page,perPage} = parsePaginationParams(req.query);
   const {sortBy, sortOrder} = parseSortParams(req.query,sortByList);


   const data = await contactServices.getContacts({userId, page , perPage , sortBy , sortOrder });

   res.json({
       status: 200,
       message: "Successfully found contacts!",
       data,
   });
};

export const getContactsByIdController =async (req,res)=>{
   const {id} = req.params;
   const { id: userId } = req.user;

   if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError(404, 'Contact not found');
   }

   const data = await contactServices.getContactById({ id, userId });

   if(!data){
      throw createHttpError(404,'Contact not found');
   }

   res.json({
      status: 200,
      message: `Successfully found contact with id ${id}!`,
      data,
   });


};

export const addContactController = async (req,res)=>{
   const {id: userId} = req.user;
   const data = await contactServices.addContact({...req.body,userId});

   res.status(201).json({
      status:201,
      message:'Successfully created a contact!',
      data,
   });
};

export const updateContactController = async (req,res)=>{
   const {id: _id} = req.params;
   const { id: userId } = req.user;
   const result = await contactServices.updateContact({_id, userId, payload:req.body});

   if(!result){
      throw createHttpError(404,'Contact not found');
   };

   res.json({
      status:200,
      message:'Successfully patched a contact!',
      data:result,
   });};

export const deleteContactController = async (req,res)=>{
   const {id: _id} = req.params;
   const { id: userId } = req.user;
   const data = await contactServices.deleteContact({_id, userId});

   if(!data){
      throw createHttpError(404,'Contact not found');
   }

   res.status(204).json({
      status:204,
      data,
      message:"Contact is deleted",
});};
