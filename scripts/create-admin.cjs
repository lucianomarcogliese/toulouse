/**
 * Script para crear el usuario admin en la base de datos.
 * Carga .env.local (donde tenés DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD).
 *
 * Uso (desde la raíz del proyecto):
 *   node scripts/create-admin.cjs
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("Faltan ADMIN_EMAIL o ADMIN_PASSWORD en .env.local");
    process.exit(1);
  }

  if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith("postgresql")) {
    console.error("DATABASE_URL en .env.local debe ser la URL de Postgres (Neon).");
    process.exit(1);
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin ya existe con ese email. Nada que hacer.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.create({
    data: { email, passwordHash },
  });

  console.log("Admin creado correctamente. Podés entrar en /admin/login con ese email y contraseña.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
