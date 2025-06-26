import { prisma } from "../providers/prisma.provider.js"; // Si usas Prisma o tu proveedor de base de datos

export class DeliveryService {
  static async getAll() {
    return prisma.delivery.findMany();
  }

  static async getById(id) {
    return prisma.delivery.findUnique({
      where: { id },
    });
  }

  static async create({ address, city, country, status }) {
    return prisma.delivery.create({
      data: {
        address,
        city,
        country,
        status,
      },
    });
  }
  static async createTx(tx, { address, city, country, status }) {
    return tx.delivery.create({
      data: {
        address,
        city,
        country,
        status,
      },
    });
  }

  static async update(id, { address, city, country, status }) {
    return prisma.delivery.update({
      where: { id },
      data: {
        address,
        city,
        country,
        status,
      },
    });
  }

  static async updateStatus(id, status) {
    return prisma.delivery.update({
      where: { id },
      data: { status },
    });
  }

  static async delete(id) {
    return prisma.delivery.delete({
      where: { id },
    });
  }
  static async deleteTx(tx, id) {
    return tx.delivery.delete({
      where: { id },
    });
  }
}
