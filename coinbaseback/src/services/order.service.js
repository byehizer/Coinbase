import { prisma } from "../providers/prisma.provider.js";

export class OrderService {
    static async getAll() {
        return prisma.order.findMany();
    }

    static async getById(id_order) {
        return prisma.order.findUnique({
            where: { id_order }
        });
    }

    static async create({ client_name, client_email, total, status, id_payment, id_delivery }) {
        return prisma.order.create({
            data: {
                client_name,
                client_email,
                total,
                status: status || "pending",
                id_payment,
                id_delivery
            },
        });
    }

    static async updateStatus(id_order, status) {
        return prisma.order.update({
            where: { id_order },
            data: { status }
        });
    }
    

    static async update(id_order, { client_name, client_email, total, status, id_payment, id_delivery }) {
        return prisma.order.update({
            where: { id_order },
            data: {
                client_name,
                client_email,
                total,
                status,
                id_payment,
                id_delivery
            }
        });
    }

    static async delete(id_order) {
        return prisma.order.delete({
            where: { id_order }
        });
    }
}
