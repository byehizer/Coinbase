import { beforeAll, afterAll, beforeEach, afterEach } from "vitest";
import prisma from "../../src/providers/prisma.provider.js";
import request from "supertest";

let User;

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
    User = await prisma.user.create({
    data: {
      name: "Test User",
      email: "test@example.com",
      password: "$2b$10$hashedpasswordhere", // usar hash real o mock de verifyPassword
      role: "admin",
    },
  });
});

afterEach(async () => {
  await prisma.user.deleteMany();
  vi.restoreAllMocks();
});

afterAll(async () => {
 await prisma.$disconnect();
});

export {User};
