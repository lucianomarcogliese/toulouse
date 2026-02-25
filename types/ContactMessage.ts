/**
 * Mensaje del formulario de contacto.
 * Coincide con Prisma ContactMessage.
 */
export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "new" | "read" | string;
  createdAt: string;
};

export type ContactMessageStatus = "new" | "read";
