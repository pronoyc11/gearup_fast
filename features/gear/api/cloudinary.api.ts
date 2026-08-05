import { env } from "@/shared/config/env";

type CloudinaryUploadResponse = {
  secure_url?: string;
  error?: {
    message?: string;
  };
};

export async function uploadGearImage(file: File) {
  if (!env.cloudinaryCloudName || !env.cloudinaryUploadPreset) {
    throw new Error("Image upload is not configured. Please check the Cloudinary settings.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", env.cloudinaryUploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${env.cloudinaryCloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });
  const payload = (await response.json()) as CloudinaryUploadResponse;

  if (!response.ok || !payload.secure_url) {
    throw new Error(payload.error?.message ?? "Could not upload the image. Please try another file.");
  }

  return payload.secure_url;
}
