import { prisma } from "../providers/prisma.provider.js";
import { DeliveryService } from "./delivery.service.js";
import { OrderDetailService } from "./order_detail.service.js";
import { PaymentService } from "./payment.service.js";

export class OrderService {
  static async getAll() {
    return prisma.order.findMany({
      include: {
        payment: true,
      },
    });
  }

  static async getById(id) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        payment: true,
        delivery: true,
        OrderDetail: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  static async create({
    client_name,
    client_email,
    total,
    address,
    city,
    country,
    payment_method,
    items,
  }) {
    return await prisma.$transaction(async (tx) => {
      // 1. Crear entrega dentro de la transacción
      const delivery = await DeliveryService.createTx(tx, {
        address,
        city,
        country,
        status: "pending",
      });

      // 2. Crear pago dentro de la transacción
      const payment = await PaymentService.createTx(tx, {
        method: payment_method,
        status: "pending",
        receipt: null,
        paymentIntentId: null,
        chargeId: null,
      });

      const order = await tx.order.create({
        data: {
          client_name,
          client_email,
          total,
          status: "pending",
          id_delivery: delivery.id,
          id_payment: payment.id,
        },
      });

      for (const item of items) {
        await OrderDetailService.createTx(tx, {
          id_order: order.id,
          id_product: item.id,
          quantity: item.quantity,
          price_unit: item.price,
        });
      }

      return order;
    });
  }

  static async updateStatus(id, status) {
    return prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  static async update(
    id,
    { client_name, client_email, total, status, id_payment, id_delivery }
  ) {
    return prisma.order.update({
      where: { id },
      data: {
        client_name,
        client_email,
        total,
        status,
        id_payment,
        id_delivery,
      },
    });
  }

  static async delete(id) {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: {
          payment: true,
          delivery: true,
        },
      });

      if (!order) {
        throw new Error("Orden no encontrada");
      }

      await OrderDetailService.deleteManyByOrderTx(tx, id);

      await tx.order.delete({ where: { id } });

      if (order.id_payment) {
        await PaymentService.deleteTx(tx, order.id_payment);
      }

      if (order.id_delivery) {
        await DeliveryService.deleteTx(tx, order.id_delivery);
      }

      return { message: "Orden y relaciones eliminadas con éxito" };
    });
  }
}
