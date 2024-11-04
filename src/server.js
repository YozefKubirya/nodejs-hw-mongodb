import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import { envFunc } from './utils/env.js';
import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
const PORT=Number(envFunc("PORT",3000));

export const setupServer=()=>{
const app=express();
app.use(cors());

const logger =pino({
      transport:{target:'pino-pretty'}
   });
   // app.use(logger);
   app.use(express.json());
app.use('/contacts',contactsRouter);

app.use(notFoundHandler);

app.use(errorHandler);


app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));
};






