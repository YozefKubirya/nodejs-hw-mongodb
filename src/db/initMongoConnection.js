// mongodb+srv://Yozef:<db_password>@cluster0.5z646.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
import { envFunc } from "../utils/env.js";
import mongoose from "mongoose";

export const initMongoConnection=async()=>{
try {
const user=envFunc("MONGODB_USER");
const password=envFunc("MONGODB_PASSWORD");
const url=envFunc("MONGODB_URL");
const db=envFunc("MONGODB_DB");
await mongoose.connect(`mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`);
console.log("Mongo connection successfully established!");
} catch (error) {
console.log(`Error connect data base with message ${error.message}`);
throw error;
}
};
