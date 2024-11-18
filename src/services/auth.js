import createHttpError from "http-errors";
import UserCollection from "../db/models/User.js";
import bcrypt from 'bcrypt';
import {randomBytes} from 'crypto';
import SessionCollection from "../db/models/Session.js";
import { accessTokenLifeTime, refreshTokenLifeTime } from "../constants/users.js";


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
