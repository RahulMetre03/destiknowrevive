import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "cloud",
  api_key: "key",
  api_secret: "UC-secret-s",
  secure: true
});

export default cloudinary;