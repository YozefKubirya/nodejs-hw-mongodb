import {v2 as cloudinary} from 'cloudinary';
import {envFunc} from '../utils/env.js';
import { unlink} from 'node:fs/promises';
const cloud_name = envFunc("CLOUDINARY_CLOUD_NAME");
const api_key = envFunc("CLOUDINARY_API_KEY");
const api_secret = envFunc("CLOUDINARY_CLOUD_SECRET");

cloudinary.config({
   cloud_name,
   api_key,
   api_secret
});

export const saveFileToCloudInary = async (file,folder) => {
   try {
      const response = await cloudinary.uploader.upload(file.path, {
         folder,
      });
      return response.secure_url;


   }catch(error){
      throw error;
   }finally{
      await unlink(file.path);
   }
};
