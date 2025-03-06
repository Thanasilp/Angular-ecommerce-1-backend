"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cloudinary_1 = require("cloudinary");
var dotenv = require("dotenv");
dotenv.config(); // โหลดค่าตัวแปรจาก .env
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
exports.default = cloudinary_1.v2;
