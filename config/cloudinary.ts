import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";
dotenv.config(); // โหลดค่าตัวแปรจาก .env

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export default cloudinary;
