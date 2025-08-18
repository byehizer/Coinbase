import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/hash";

const prisma = new PrismaClient();

async function main() {
  const password = "admin123"; // Cambialo por una contraseña segura
  const hashedPassword = hashPassword(password);

  const adminExists = await prisma.user.findUnique({
    where: { email: "admin@admin.com" },
  });

  if (!adminExists) {
    await prisma.user.create({
      data: {
        email: "admin@coinbase.com",
        password: hashedPassword,
        role: "admin", 
      },
    });
    console.log("Admin user created");
  } else {
    console.log("Admin user already exists");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
