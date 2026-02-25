import "server-only";
import { v2 as cloudinary } from "cloudinary";

function getConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

/** Preset no firmado: si está definido, subimos con él y no usamos API Secret (evita Invalid Signature). */
function getUploadPreset(): string | null {
  const preset = process.env.CLOUDINARY_UPLOAD_PRESET;
  return preset?.trim() || null;
}

export function isCloudinaryConfigured(): boolean {
  const hasPreset = getUploadPreset() && process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY;
  return getConfig() !== null || hasPreset === true;
}

function ensureConfigured(): { cloudName: string; apiKey: string; apiSecret: string } {
  const c = getConfig();
  if (!c) throw new Error("Cloudinary is not configured (missing CLOUDINARY_CLOUD_NAME, API_KEY or API_SECRET).");
  return c;
}

/**
 * Sube un buffer a Cloudinary.
 * Si CLOUDINARY_UPLOAD_PRESET está definido, usa upload unsigned (no requiere API Secret correcto).
 * Si no, usa upload firmado con API Secret.
 */
export async function uploadImage(
  buffer: Buffer,
  _filename: string
): Promise<{ url: string; publicId: string }> {
  const preset = getUploadPreset();
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();

  if (preset && cloudName && apiKey) {
    return uploadUnsigned(buffer, cloudName, apiKey, preset);
  }

  const { cloudName: cn, apiKey: key, apiSecret: secret } = ensureConfigured();
  cloudinary.config({ cloud_name: cn, api_key: key, api_secret: secret });

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

/** Upload usando preset no firmado (no usa API Secret). */
async function uploadUnsigned(
  buffer: Buffer,
  cloudName: string,
  apiKey: string,
  uploadPreset: string
): Promise<{ url: string; publicId: string }> {
  const b64 = buffer.toString("base64");
  const dataUri = `data:image/jpeg;base64,${b64}`;

  const form = new FormData();
  form.set("file", dataUri);
  form.set("api_key", apiKey);
  form.set("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
    const msg = (err as { error?: { message?: string } })?.error?.message ?? res.statusText;
    throw new Error(msg);
  }

  const result = (await res.json()) as { secure_url?: string; public_id?: string };
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
