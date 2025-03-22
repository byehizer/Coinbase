import { prisma } from "../providers/prisma.provider.js";

export class PaymentService {
    static async getAll() {
        return prisma.payment.findMany();
    }

    static async getById(id_payment) {
        return prisma.payment.findUnique({
            where: {
                id_payment
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

    static async updateStatus(id_payment, status) {
        return prisma.payment.update({
            where: { id_payment },
            data: { status }
        });
    }


    static async update(id_payment, { method, status, receipt }) {
        return prisma.payment.update({
            where: { id_payment },
            data: { method, status, receipt }
        });
    }

    static async delete(id_payment) {
        return prisma.payment.delete({
            where: {
                id_payment,
            },
        });
    }
}
