import { v2 as cloudinary } from "cloudinary";

export default async function uploadFileToCloudinary(file: File): Promise<any> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream((error, uploadResult) => {
        if (error) return reject(error);
        resolve(uploadResult);
      })
      .end(buffer);
  });

  return uploadResult;
}
