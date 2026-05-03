import 'server-only'

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export async function uploadBase64(base64: string, folder: string): Promise<string> {
  const result = await cloudinary.uploader.upload(base64, { folder })

  return result.secure_url
}
