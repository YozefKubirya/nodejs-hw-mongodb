// import createHttpError from "http-errors";
import * as  authServices from '../services/auth.js';

import { generateAuthUrl } from '../utils/googleOAuth2.js';

const setupSession = (res,session) => {

   const {id, refreshToken,refreshTokenValidUntil} = session;
   res.cookie("refreshToken", refreshToken , {
      httpOnly: true,
      expires: refreshTokenValidUntil,
   });

   res.cookie("sessionId", id , {
      httpOnly: true,
      expires: refreshTokenValidUntil,
   });

};

export const registerController = async(req,res) => {
   const data = await authServices.register(req.body);
   console.log(data);
   res.status(201).json({
      status: 201,
      message: 'Successfully registered user',
      data: {
         id: data._id,
         email: data.email,
     },
   });
};

export const loginController = async(req,res) => {
   const session = await authServices.login(req.body);

   setupSession(res,session);

   res.json({
      status: 200,
      message: "Successfully logged in an user!",
      data: {
          accessToken:session.accessToken,
      }
   });
};

export const refreshSessionController = async(req,res) => {
   const session = await authServices.refreshUserSession(req.cookies);

   setupSession(res,session);

   res.json({
      status: 200,
      message: "Successfully refresh session!",
      data: {
          accessToken:session.accessToken,
      }
   });
};

export const logoutController = async(req,res) => {
   if(req.cookies.sessionId){
      await authServices.logout(req.cookies.sessionId);
   }
   res.clearCookie("sessionId");
   res.status(204).send();

};

export const requestResetEmailController = async (req, res) => {
   await authServices.requestResetToken(req.body.email);
   res.json({
     message: 'Reset password email has been successfully sent',
     status: 200,
     data: {},
   });
 };

export const resetPasswordController = async (req, res) => {
   await authServices.resetPassword(req.body);
   res.json({
     message: 'Password has been successfully reset.',
     status: 200,
     data: {},
   });
 };

export const getGoogleoAuthUrlController = (req,res) => {
   const url = generateAuthUrl();

   res.json({
      status: 200,
      message:'Successfully get Google OAuth Url',
      data:{
         url,
      }
   });
};

export const loginWithGoogleController = async(req,res) => {
   const session = await authServices.loginOrRegisterWithGoogle(req.body.code);

   setupSession(res,session);

   res.json({
      status: 200,
      message: "Successfully login with Google!",
      data: {
          accessToken:session.accessToken,
      }
   });

};
