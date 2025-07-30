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

  static async findByIntentId(paymentIntentId) {
    return prisma.payment.findFirst({
      where: {
        paymentIntentId,
      },
    });
  }

 static async updateReceipt(orderId, fileUrl) {
    
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order || !order.payment) {
      throw new Error("Order or associated payment not found");
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: order.payment.id },
      data: { receipt: fileUrl },
    });

    return updatedPayment;
  }

  static async findByOrderId(orderId) {
    return prisma.payment.findFirst({
      where: {
        Order: {
          some: { id: orderId },
        },
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

  static async createTx(
    tx,
    { method, status, receipt, paymentIntentId, chargeId }
  ) {
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

  static async update(id, data) {
    // Elimina keys cuyo valor sea undefined
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );

    return prisma.payment.update({
      where: { id: Number(id) },
      data: cleanData,
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
