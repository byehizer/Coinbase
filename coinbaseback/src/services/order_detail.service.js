import { prisma } from "../providers/prisma.provider.js";

export class OrderDetailService {
    static async getAll() {
        return prisma.orderDetail.findMany({
            include: {
                order: true,
                product: true,
            }
        });
    }

    static async getById(id_order_detail) {
        return prisma.orderDetail.findUnique({
            where: {
                id_order_detail,
            },
            include: {
                order: true,
                product: true,
            }
        });
    }

    static async create({ id_order, id_product, quantity, price_unit }) {
        return prisma.orderDetail.create({
            data: {
                id_order,
                id_product,
                quantity,
                price_unit,
            },
        });
    }

    static async update(id_order_detail, { quantity, price_unit }) {
        return prisma.orderDetail.update({
            where: { id_order_detail },
            data: {
                quantity,
                price_unit,
            },
        });
    }

    static async delete(id_order_detail) {
        return prisma.orderDetail.delete({
            where: {
                id_order_detail,
            },
        });
    }
}
