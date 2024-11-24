import multer from 'multer';
import {TEMPS_UPLOADS_DIR} from '../constants/index.js';
import createHttpError from 'http-errors';
 export const storage = multer.diskStorage({
destination:TEMPS_UPLOADS_DIR,
filename:(req,file,callback) => {
   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
   const filename = `${uniqueSuffix}_${file.originalname}`;
   callback(null, filename);
}
 });

const fileFilter = (req,file,callback) => {
   const extension = file.originalname.split('.').pop();
   if(extension === 'exe'){
      return callback(createHttpError(400, '.exe extension not allowed'));
   };
   callback(null, true);
};
export const upload = multer({
   storage,
   fileFilter
});
