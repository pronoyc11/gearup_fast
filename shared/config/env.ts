

export const env = {
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    "https://gearup-backend-gold.vercel.app",
  cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "",
  cloudinaryUploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "",
};
