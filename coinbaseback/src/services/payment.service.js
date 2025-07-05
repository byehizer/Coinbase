import { prisma } from "../providers/prisma.provider.js";

export class PaymentService {
  static async getAll() {
    return prisma.payment.findMany();
  }

  static async getById(id) {
    return prisma.payment.findUnique({
      where: {
        id,
      },
    });
  }

  static async findByIntentId(paymentIntentId){
    return prisma.paymentIntentId.findUnique({
      where: {
        paymentIntentId,
      },
    });
  }

  static async create({ method, status, receipt, paymentIntentId, chargeId }) {
    return prisma.payment.create({
      data: {
        method,
        status,
        receipt, 
        paymentIntentId,
        chargeId,
      },
    });
  }

  static async createTx(tx, { method, status, receipt, paymentIntentId, chargeId }) {
    return tx.payment.create({
      data: {
        method,
        status,
        receipt,
        paymentIntentId,
        chargeId,
      },
    });
  }
  static async updateStatus(id, status) {
    return prisma.payment.update({
      where: { id },
      data: { status },
    });
  }
  static async updateMethod(id, method) {
  return prisma.payment.update({
    where: { id },
    data: { method },
  });
}

  static async update(id, { method, status, receipt, paymentIntentId, chargeId }) {
    return prisma.payment.update({
      where: { id },
      data: { method, status, receipt, paymentIntentId, chargeId },
    });
  }

  static async delete(id) {
    return prisma.payment.delete({
      where: {
        id,
      },
    });
  }
  static async deleteTx(tx, id) {
    return tx.payment.delete({
      where: { id },
    });
  }
}
