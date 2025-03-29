import { prisma } from "../providers/prisma.provider.js";

export class PaymentService {
    static async getAll() {
        return prisma.payment.findMany();
    }

    static async getById(id) {
        return prisma.payment.findUnique({
            where: {
                id
            }
        });
    }

    static async create({ method, status, receipt }) {
        return prisma.payment.create({
            data: {
                method,
                status,
                receipt, // Puede ser null o string
            },
        });
    }

    static async updateStatus(id, status) {
        return prisma.payment.update({
            where: { id },
            data: { status }
        });
    }


    static async update(id, { method, status, receipt }) {
        return prisma.payment.update({
            where: { id },
            data: { method, status, receipt }
        });
    }

    static async delete(id) {
        return prisma.payment.delete({
            where: {
                id,
            },
        });
    }
}
