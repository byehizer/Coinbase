import { prisma } from "../providers/prisma.provider.js";

export class ProductService {
    static async getAll() {
        return prisma.product.findMany();
    }

    static async getById(id_product) {
        return prisma.product.findUnique({
            where: {
                id_product
            }
        });
    }

    static async create({ name, description, year, country_origin, price, stock, image_url }) {
        return prisma.product.create({
            data: {
                name,
                description,
                year,
                country_origin,
                price,
                stock,
                image_url
            },
        });
    }

    static async update(id_product, { name, description, year, country_origin, price, stock, image_url }) {
        return prisma.product.update({
            where: {
                id_product
            },
            data: {
                name,
                description,
                year,
                country_origin,
                price,
                stock,
                image_url
            }
        });
    }

    static async delete(id_product) {
        return prisma.product.delete({
            where: {
                id_product
            }
        });
    }
}
