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
  
  static async findByPaymentId(paymentId) {
  return prisma.order.findFirst({
    where: { id_payment: paymentId },
    include: {
      OrderDetail: true,      // para stock
    },
  });
}

  static   async deleteCascade(id) {
    return prisma.$transaction(async (tx) => {
      // 1. Traer la orden con IDs de delivery y payment
      const order = await tx.order.findUnique({
        where: { id },
        select: { id, id_payment: true, id_delivery: true },
      });
      if (!order) throw new Error("Order not found");

      // 2. Borrar líneas de detalle (por claridad; el ON DELETE CASCADE también sirve)
      await tx.orderDetail.deleteMany({ where: { id_order: id } });

      // 3. Borrar la orden principal
      await tx.order.delete({ where: { id } });

      // 4. Borrar PAYMENT solo si ninguna otra orden lo usa
      if (order.id_payment) {
        const stillUsed = await tx.order.count({
          where: { id_payment: order.id_payment },
        });
        if (stillUsed === 0) {
          await tx.payment.delete({ where: { id: order.id_payment } });
        }
      }

      // 5. Borrar DELIVERY solo si ninguna otra orden lo usa
      if (order.id_delivery) {
        const stillUsed = await tx.order.count({
          where: { id_delivery: order.id_delivery },
        });
        if (stillUsed === 0) {
          await tx.delivery.delete({ where: { id: order.id_delivery } });
        }
      }

      return order; // opcional: podrías devolver null si no lo necesitás
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
        console.log(item.image_url);
        await OrderDetailService.createTx(tx, {
          id_order: order.id,
          id_product: item.id,
          quantity: item.quantity,
          price_unit: item.price,
          product_name: item.name,
          product_image_url:item.image_url,

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
static async update(id, { client_name, client_email, status }) {
  return prisma.order.update({
    where: { id },
    data: {
      client_name,
      client_email,
      status,
    },
    include: {
      delivery: true,
      payment: true,
      OrderDetail: {
        include: { product: true },
      },
    },
  });
}
async getMinimal(id) {
    return prisma.order.findUnique({
      where: { id },
      select: { id_delivery: true },
    });
  }

  static async getOrderItems(order_id) {
    return await prisma.orderDetail.findMany({
      where: {
        id_order: order_id,
      },
      select: {
        id_product: true,
        quantity: true,
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
