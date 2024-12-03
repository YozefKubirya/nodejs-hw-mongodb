import createHttpError from "http-errors";
import UserCollection from "../db/models/User.js";
import bcrypt from 'bcrypt';
import {randomBytes} from 'crypto';
import SessionCollection from "../db/models/Session.js";
import { accessTokenLifeTime, refreshTokenLifeTime } from "../constants/users.js";
import jwt from 'jsonwebtoken';
import { SMTP } from "../constants/index.js";
import  {envFunc} from "../utils/env.js";
import { sendEmail } from "../utils/sendMail.js";
import { validateCode, getUserNameFromGoogleTokenPayload } from "../utils/googleOAuth2.js";

const createSession = () => {
   const accessToken = randomBytes(30).toString('base64');
   const refreshToken = randomBytes(30).toString('base64');
   return {
      accessToken,
      refreshToken,
      accessTokenValidUntil: Date.now() + accessTokenLifeTime,
      refreshTokenValidUntil: Date.now() + refreshTokenLifeTime
   };


};

export const register = async payload => {
   const {email,password} = payload;
   const user = await UserCollection.findOne({email});

   if(user){
      throw createHttpError(409, "Email in use");
   }
   const hashPassword = await bcrypt.hash(password, 10);
   const newUser = await UserCollection.create({ ...payload, password: hashPassword });


    const { password: _, ...userWithoutPassword } = newUser.toObject();

    return userWithoutPassword;


   // return UserCollection.create({...payload, password: hashPassword});
};

export const login = async ({email,password}) => {

   const user = await UserCollection.findOne({email});
   console.log('User:',user);

   if(!user){
      throw createHttpError(401, "Email or password invalid");
   }
   const comparedPasswords = await bcrypt.compare(password , user.password);

   if(!comparedPasswords){
      throw createHttpError(401,"Email or password invalid");
   };

   await SessionCollection.deleteOne({userId: user.id});

   const newSession = createSession();

   return SessionCollection.create({
      userId:user.id,
      ...newSession
   });

};

export const refreshUserSession = async({sessionId , refreshToken}) => {
   const session = await SessionCollection.findOne({_id: sessionId, refreshToken});
   if(!session){
      throw createHttpError(401,"Session not fount");
   };
   if(Date.now() > session.refreshTokenValidUntil){
      throw createHttpError(401,"Session is expired");
   }
   await SessionCollection.deleteOne({userId:session.userId});

   const newSession = createSession();

   return SessionCollection.create({
      userId:session.userId,
      ...newSession
   });
};

export const logout = async (sessionId) => {
   await SessionCollection.deleteOne({_id: sessionId});

};

export const findSession = filter => SessionCollection.findOne(filter);

export const findUser = filter => UserCollection.findOne(filter);

export const requestResetToken = async (email) => {
   const user = await UserCollection.findOne({ email });
   if (!user) {
     throw createHttpError(404, 'User not found');
   };
   const resetToken = jwt.sign(
      {
         sub : user._id,
         email
      },
      envFunc('JWT_SECRET'),
      {
         expiresIn: '5m',
       },
   );

   const resetLink = `${envFunc('APP_DOMAIN')}/reset-password?token=${resetToken}`;
   ;

    try {
      await sendEmail({
         from: envFunc(SMTP.SMTP_FROM),
         to: email,
         subject: 'Reset your password',
         html: `<p>Click <a href="${resetLink}">here</a> to reset your password!</p>`,
      });
   } catch (error) {
      throw createHttpError(500, 'Failed to send the email, please try again later.');
   }


 };

export const resetPassword = async (payload) => {
   let entries;

   try {
     entries = jwt.verify(payload.token, envFunc('JWT_SECRET'));
   } catch (err) {
      if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
         throw createHttpError(401, 'Token is expired or invalid.');
      }
      throw err;
   }

   const user = await UserCollection.findOne({
     email: entries.email,
     _id: entries.sub,
   });

   if (!user) {
     throw createHttpError(404, 'User not found');
   }

   const encryptedPassword = await bcrypt.hash(payload.password, 10);

   await SessionCollection.deleteOne({userId: user.id});

   await UserCollection.updateOne(
     { _id: user._id },
     { password: encryptedPassword },
   );
 };

export const loginOrRegisterWithGoogle = async code => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  if(!payload) {
   throw createHttpError(401);
  }
  let user = await UserCollection.findOne({
   email: payload.email,
  });
  if(!user) {
   const password = await bcrypt.hash(randomBytes(10),10);
   const username = getUserNameFromGoogleTokenPayload(payload);

   user = UserCollection.create({
      email: payload.email,
      username,
      password,

   });

  };

  const newSession = createSession();

   return SessionCollection.create({
      userId:user.id,
      ...newSession
   });

};


