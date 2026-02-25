import "server-only";
import { Readable } from "stream";
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
 * Sube un buffer a Cloudinary. Solo usar en servidor (credenciales).
 * @returns secure_url como url y public_id como publicId
 */
export async function uploadImage(
  buffer: Buffer,
  filename: string
): Promise<{ url: string; publicId: string }> {
  const { cloudName, apiKey, apiSecret } = ensureConfigured();
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

  const folder = process.env.CLOUDINARY_FOLDER ?? "toulouse";

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (err) return reject(err);
        if (!result?.secure_url || !result?.public_id) {
          return reject(new Error("Invalid Cloudinary response: missing secure_url or public_id"));
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    Readable.from(buffer).pipe(stream);
  });
}

/**
 * Elimina un asset en Cloudinary por public_id.
 */
export async function deleteImage(publicId: string): Promise<void> {
  const { cloudName, apiKey, apiSecret } = ensureConfigured();
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
  await cloudinary.uploader.destroy(publicId);
}
