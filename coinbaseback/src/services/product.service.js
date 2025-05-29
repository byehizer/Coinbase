import { prisma } from "../providers/prisma.provider.js";

export class ProductService {
    static async getAll() {
        return prisma.product.findMany();
    }

    static async getById(id) {
        return prisma.product.findUnique({
            where: {
                id
            }
        });
    }

    static async create({ name, description, year, country_origin, price, stock, image_url }) {
        return prisma.product.create({
            data: {
            name,
            description,
            year: parseInt(year, 10),
            country_origin,
            price: parseFloat(price),
            stock: parseInt(stock, 10),
            image_url
            },
        });
    }

    static async update(id, { name, description, year, country_origin, price, stock, image_url }) {
        return prisma.product.update({
            where: {
                id
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

    static async delete(id) {
        return prisma.product.delete({
            where: {
                id
            }
        });
    }
}
