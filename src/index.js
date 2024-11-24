import { setupServer } from "./server.js";
import { initMongoConnection } from "./db/initMongoConnection.js";
import { createDirIfNotExist } from "./utils/createDirIfNotExist.js";
import { TEMPS_UPLOADS_DIR,UPLOADS_DIR } from "./constants/index.js";
const boostrap=async()=>{
   await initMongoConnection();
   await createDirIfNotExist(TEMPS_UPLOADS_DIR);
   await createDirIfNotExist(UPLOADS_DIR);
   setupServer();
};
boostrap();
