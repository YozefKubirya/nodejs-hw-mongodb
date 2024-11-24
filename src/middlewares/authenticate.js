import createHttpError from "http-errors";
import { findSession, findUser } from "../services/auth.js";
export const authenticate = async(req,res,next) => {
   const authHeader = req.get("Authorization");
   console.log(authHeader);

   if(!authHeader){
      return next(createHttpError(401,"Authorization missing header"));
   }
   const [bearer, token] = authHeader.split(" ");

   if(bearer !== "Bearer"){
      return next(createHttpError(401,"Authorization header must be type Bearer"));
   }

   const session = await findSession({accessToken: token});
   console.log(session);

   if(!session){
      return next(createHttpError(401,"Session not found"));
   }

   if(Date.now() > session.accessTokenValidUntil){
      return next(createHttpError(401,"Access Token expired"));
   }

   const user = await findUser({_id: session.userId});

   if(!user){
      return next(createHttpError(401,"User not found"));
   }
   req.user = user;
   next();

};