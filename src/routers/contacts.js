import { Router } from "express";
import * as contactsController from '../controllers/contacts.js';
import ctrlWrapper from "../utils/ctrlWrapper.js";
import { validateBody } from "../utils/validateBody.js";
import { contactAddSchema,contactUpdateSchema } from "../validation/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";
const contactsRouter = Router();

contactsRouter.get('/',ctrlWrapper(contactsController.getContactsController));

contactsRouter.get('/:id',isValidId,ctrlWrapper(contactsController.getContactsByIdController));

contactsRouter.post('/',validateBody(contactAddSchema),ctrlWrapper(contactsController.addContactController));

contactsRouter.patch('/:id',isValidId,validateBody(contactUpdateSchema),ctrlWrapper(contactsController.updateContactController));

contactsRouter.delete('/:id',isValidId,ctrlWrapper(contactsController.deleteContactController));

export default contactsRouter;
