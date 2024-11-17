import ContactsCollection from "../db/models/Contact.js";
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContacts = async ({userId ,page = 1,perPage = 10, sortBy = "id", sortOrder = "asc", }) => {

   const skip = (page - 1) * perPage;

   const data = await ContactsCollection.find({userId}).skip(skip).limit(perPage).sort({[sortBy]: sortOrder});
   console.log(userId);
   const totalItems = await ContactsCollection.countDocuments({userId});

   const paginationData = calculatePaginationData({totalItems , page , perPage});

   return {
      data,
      ...paginationData
   };

};

export const getContactById = ({ id, userId }) => ContactsCollection.findOne({_id:id, userId});

export const addContact =  payload => ContactsCollection.create(payload);

export const updateContact = async({_id,userId,payload}) => {
   const data = await ContactsCollection.findOneAndUpdate({_id, userId},payload,{ new: true });
   return data;
};

export const deleteContact = async ({ _id, userId }) => {
   return ContactsCollection.findOneAndDelete({ _id, userId });
};
