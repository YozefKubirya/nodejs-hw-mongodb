import ContactsCollection from "../db/models/Contact.js";
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContacts = async ({page = 1,perPage = 10, sortBy = "id", sortOrder = "asc"}) => {
   const skip = (page - 1) * perPage;
   const data = await ContactsCollection.find().skip(skip).limit(perPage).sort({[sortBy]: sortOrder});
   const totalItems = await ContactsCollection.countDocuments();
   const paginationData = calculatePaginationData({totalItems , page , perPage});
   return {
      data,
      ...paginationData
   };

};

export const getContactById = id => ContactsCollection.findById(id);

export const addContact =  payload => ContactsCollection.create(payload);

export const updateContact = async({_id,payload}) => {
   const data = await ContactsCollection.findOneAndUpdate({_id},payload,{ new: true });
   return data;
};

export const deleteContact = async filter => {
   return ContactsCollection.findOneAndDelete(filter);
};
