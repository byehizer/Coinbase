import { prisma } from "../providers/prisma.provider.js";

export class MessageService {

    static async getAll() {
        return prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
    }

    static async getById(id) {
        return prisma.message.findUnique({ where: { id: Number(id) } });
    }

    static async create({ name, email, message }) {
        return prisma.message.create({
            data: {
                name,
                email,
                message,
            },
        });
    }


    static async delete(id) {
        return prisma.message.delete({ where: { id: Number(id) } });
    }
}
