import { OAuth2Client } from 'google-auth-library';
import * as path from 'node:path';
import { readFile} from 'node:fs/promises';
import { envFunc } from '../utils/env.js';
import createHttpError from 'http-errors';

const googleOAuthSettingsPath = path.resolve('google-oauth.json');

const oAuthConfig = JSON.parse(await readFile(googleOAuthSettingsPath,"utf-8"));

const googleOAuthClient = new OAuth2Client({
   clientId:envFunc('GOOGLE_AUTH_CLIENT_ID'),
   clientSecret:envFunc('GOOGLE_AUTH_CLIENT_SECRET'),
   redirectUri:oAuthConfig.web.redirect_uris[0]

});

export const generateAuthUrl = () =>
   googleOAuthClient.generateAuthUrl({
     scope: [
       'https://www.googleapis.com/auth/userinfo.email',
       'https://www.googleapis.com/auth/userinfo.profile',
     ],
   });

export const validateCode = async code => {
   const response = await googleOAuthClient.getToken(code);
   if(response.tokens.id_token) {
      throw createHttpError(401);

   };

   const ticket = await googleOAuthClient.verifyIdToken({
      idToken: response.tokens.id_token,

   });
   return ticket;

};

export const getUserNameFromGoogleTokenPayload = payload => {
   if(payload.name) return payload.name;
   let username = '';
   if(payload.given_name){
      username += payload.given_name;
   }
   if(payload.family_name){
      username += payload.given_name;
   }
   return username;
};
