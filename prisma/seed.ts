import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@tautanrasa.com";
  const rawPassword = "admin123";

  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {}, // tidak update jika sudah ada
    create: {
      nama: "Administrator",
      email: email,
      noHp: "081234567890", // wajib isi karena tidak nullable
      password: hashedPassword,
      alamat: "Admin System",
      role: Role.ADMIN,
    },
  });

  console.log("Admin created:", admin);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
