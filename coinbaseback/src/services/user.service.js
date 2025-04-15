import { prisma } from "../providers/prisma.provider.js";

export class UserService {
  static async getAll() {
    return prisma.user.findMany();
  }

  static async getById(id_user) {
    return prisma.user.findFirst({
      where: { id_user },
    });
  }

  static async getByEmail({ email }) {
    return prisma.user.findFirst({
      where: { email },
    });
  }

  static async create({ name, email, password, role }) {
    return prisma.user.create({
      data: {
        name,
        email,
        password,
        role,
      },
    });
  }
}
