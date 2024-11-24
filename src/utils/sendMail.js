import nodemailer from 'nodemailer';
import { SMTP } from '../constants/index.js';
import { envFunc } from '../utils/env.js';

const transporter = nodemailer.createTransport({
   host: envFunc(SMTP.SMTP_HOST),
   port: Number(envFunc(SMTP.SMTP_PORT)),
   auth: {
     user: envFunc(SMTP.SMTP_USER),
     pass: envFunc(SMTP.SMTP_PASSWORD),
   },
 });

 export const sendEmail = async (options) => {
   return await transporter.sendMail(options);
 };
