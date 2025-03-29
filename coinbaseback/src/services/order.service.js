import { prisma } from "../providers/prisma.provider.js";

export class OrderService {
    static async getAll() {
        return prisma.order.findMany();
    }

    static async getById(id) {
        return prisma.order.findUnique({
            where: { id }
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

    static async updateStatus(id, status) {
        return prisma.order.update({
            where: { id },
            data: { status }
        });
    }
    

    static async update(id, { client_name, client_email, total, status, id_payment, id_delivery }) {
        return prisma.order.update({
            where: { id },
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

    static async delete(id) {
        return prisma.order.delete({
            where: { id }
        });
    }
}
