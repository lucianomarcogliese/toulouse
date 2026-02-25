/** Lista de variables de entorno requeridas en servidor (usado para el tipo RequiredServerEnvKey). */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- used for type RequiredServerEnvKey
const REQUIRED_SERVER_ENV = ["RESEND_API_KEY", "SESSION_SECRET", "DATABASE_URL"] as const;

export type RequiredServerEnvKey = (typeof REQUIRED_SERVER_ENV)[number];

type NodeEnv = "development" | "test" | "production";

type Env = {
  NODE_ENV: NodeEnv;
  RESEND_API_KEY: string;
  SESSION_SECRET: string;
  DATABASE_URL: string;
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
  /** Cloudinary (producción): si están definidas, el upload usa Cloudinary en lugar de /public/uploads */
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
  CLOUDINARY_FOLDER?: string;
};

function getRequiredEnv(key: RequiredServerEnvKey): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(
      `Missing required environment variable "${key}". ` +
        `Define it in your .env.local (for development) or in your hosting provider's environment configuration (for production).`,
    );
  }

  return value;
}

const nodeEnv = (process.env.NODE_ENV ?? "development") as NodeEnv;

export const env = {
  NODE_ENV: nodeEnv,
  get RESEND_API_KEY() {
    return getRequiredEnv("RESEND_API_KEY");
  },
  get SESSION_SECRET() {
    return getRequiredEnv("SESSION_SECRET");
  },
  get DATABASE_URL() {
    return getRequiredEnv("DATABASE_URL");
  },
  get ADMIN_EMAIL() {
    return process.env.ADMIN_EMAIL;
  },
  get ADMIN_PASSWORD() {
    return process.env.ADMIN_PASSWORD;
  },
  get CLOUDINARY_CLOUD_NAME() {
    return process.env.CLOUDINARY_CLOUD_NAME;
  },
  get CLOUDINARY_API_KEY() {
    return process.env.CLOUDINARY_API_KEY;
  },
  get CLOUDINARY_API_SECRET() {
    return process.env.CLOUDINARY_API_SECRET;
  },
  get CLOUDINARY_FOLDER() {
    return process.env.CLOUDINARY_FOLDER ?? "toulouse";
  },
} satisfies Env;

