import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({
  path: path.resolve(__dirname, "../.env.test"),override: true
});


import prisma from "../src/providers/prisma.provider.js";

beforeAll(async () => {
  await prisma.$executeRaw`PRAGMA foreign_keys = OFF;`;
  const tables = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table';`;
  for (const { name } of tables) {
    if (name !== "_prisma_migrations") {
      try {
        await prisma.$executeRawUnsafe(`DELETE FROM "${name}";`);
      } catch (err) {
        console.error(`Error limpiando tabla ${name}:`, err.message);
      }
    }
  }
  await prisma.$executeRaw`PRAGMA foreign_keys = ON;`;
});

afterAll(async () => {
  await prisma.$disconnect();
});
