import { z } from "zod";

const nonEmptyString = z.string().trim().min(1, "Requerido");

export const photoCreateSchema = z.object({
  title: nonEmptyString,
  category: nonEmptyString,
  src: nonEmptyString,
  featured: z.boolean().optional().default(false),
  publicId: z.string().trim().optional(), // Cloudinary public_id → se guarda como cloudinaryId
});

export const photoPatchSchema = z.object({
  title: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const contactFormSchema = z.object({
  nombre: nonEmptyString,
  email: z.string().trim().min(1, "Email requerido").email("Email inválido"),
  mensaje: nonEmptyString,
  website: z.string().trim().optional().default(""),
});

export const contactMessageStatusSchema = z.enum(["new", "read"]);

export const reorderDirectionSchema = z.enum(["up", "down"]);

export type PhotoCreateInput = z.infer<typeof photoCreateSchema>;
export type PhotoPatchInput = z.infer<typeof photoPatchSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
