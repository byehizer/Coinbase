import { prisma } from "../providers/prisma.provider.js";

export class ProductService {
  static async getAll() {
    return prisma.product.findMany();
  }

  static async getById(id) {
    return prisma.product.findUnique({
      where: {
        id,
      },
    });
  }

  static async create({
    name,
    description,
    year,
    country_origin,
    price,
    stock,
    image_url,
  }) {
    return prisma.product.create({
      data: {
        name,
        description,
        year,
        country_origin,
        price,
        stock,
        image_url,
      },
    });
  }
  static async decreaseStock(productId, quantity) {
    return prisma.product.update({
      where: { id: productId },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });
  }

  static async increaseStock(productId, quantity) {
    return prisma.product.update({
      where: { id: productId },
      data: {
        stock: {
          increment: quantity,
        },
      },
    });
  }

  static async update(
    id,
    { name, description, year, country_origin, price, stock, image_url }
  ) {
    return prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        year,
        country_origin,
        price,
        stock,
        image_url,
      },
    });
  }

  static async delete(id) {
    return prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
