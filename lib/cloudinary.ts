import "server-only";
import { v2 as cloudinary } from "cloudinary";

function getConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

export function isCloudinaryConfigured(): boolean {
  return getConfig() !== null;
}

function ensureConfigured(): { cloudName: string; apiKey: string; apiSecret: string } {
  const c = getConfig();
  if (!c) throw new Error("Cloudinary is not configured (missing CLOUDINARY_CLOUD_NAME, API_KEY or API_SECRET).");
  return c;
}

/**
 * Sube un buffer a Cloudinary usando base64 (más estable en serverless/Vercel que stream).
 * @returns secure_url como url y public_id como publicId
 */
export async function uploadImage(
  buffer: Buffer,
  _filename: string
): Promise<{ url: string; publicId: string }> {
  const { cloudName, apiKey, apiSecret } = ensureConfigured();
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

  const folder = process.env.CLOUDINARY_FOLDER ?? "toulouse";
  const b64 = buffer.toString("base64");
  const dataUri = `data:image/jpeg;base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
  });

  if (!result?.secure_url || !result?.public_id) {
    throw new Error("Invalid Cloudinary response: missing secure_url or public_id");
  }
  return { url: result.secure_url, publicId: result.public_id };
}

/**
 * Elimina un asset en Cloudinary por public_id.
 */
export async function deleteImage(publicId: string): Promise<void> {
  const { cloudName, apiKey, apiSecret } = ensureConfigured();
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
  await cloudinary.uploader.destroy(publicId);
}
