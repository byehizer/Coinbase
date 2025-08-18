import request from "supertest";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import "../mocks/SetupMocks.js";
import * as setup from "../helpers/setupsordertest.js";
import { OrderService } from "../../src/services/order.service.js";
import { vi } from "vitest";
import { PaymentService } from "../../src/services/payment.service.js";
import { DeliveryService } from "../../src/services/delivery.service.js";

let app;
let prisma;

describe("Tests to prove Update Orders", () => {
  beforeAll(async () => {
    const appModule = await import("../../src/server.js");
    app = appModule.default;

    const prismaModule = await import("../../src/providers/prisma.provider.js");
    prisma = prismaModule.default;
  });

  it("PUT /orders/:id debería actualizar la orden y el estado de pago correctamente", async () => {
    const orderId = 1;
    const updatedData = {
      clientName: "Juan Actualizado",
      clientEmail: "juan.actualizado@example.com",
      status: "paid",
      trackingStatus: "in_transit",
      deliveryAddress: "Calle Actualizada 123",
      deliveryCity: "Buenos Aires",
      deliveryCountry: "Argentina",
    };
    vi.spyOn(OrderService, "getById").mockResolvedValue({
      id: 1,
      client_name: "Juan Actualizado",
      client_email: "juan.actualizado@example.com",
      status: "paid",
      id_payment: 2,
      id_delivery: 3,
      OrderDetail: [],
      payment: { id: 2, status: "approved" },
      delivery: {
        id: 3,
        address: "Calle Actualizada 123",
        city: "Buenos Aires",
        country: "Argentina",
        status: "in_transit",
      },
    });

    vi.spyOn(OrderService, "update").mockResolvedValue({
      id: 1,
      client_name: "Juan Actualizado",
      client_email: "juan.actualizado@example.com",
      status: "paid",
    });

    vi.spyOn(PaymentService, "updateByOrderId").mockResolvedValue({
      id: 2,
      status: "approved",
    });

    vi.spyOn(DeliveryService, "update").mockResolvedValue({
      id: 3,
      address: "Calle Actualizada 123",
      city: "Buenos Aires",
      country: "Argentina",
      status: "in_transit",
    });

    const res = await request(app)
      .put(`/api/orders/${orderId}`)
      .send(updatedData);
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", orderId);
    expect(res.body).toHaveProperty("client_name", updatedData.clientName);
    expect(res.body).toHaveProperty("client_email", updatedData.clientEmail);
    expect(res.body).toHaveProperty("status", updatedData.status);
  });

  it("debería retornar 400 si la orden no tiene payment", async () => {
    const deliveryOnly = await prisma.delivery.create({
      data: {
        address: "Calle 123",
        city: "CABA",
        country: "Argentina",
      },
    });

    const notdeliveryorder = await prisma.order.create({
      data: {
        client_name: "Juan Test",
        client_email: "juan.test@example.com",
        total: 123.45,
        status: "pending",
        id_delivery: deliveryOnly.id,
        OrderDetail: {
          create: [
            {
              product_name: "Producto de prueba",
              quantity: 2,
              price_unit: 61.725,
              product_image_url: "https://example.com/fake-image.jpg",
            },
          ],
        },
      },
      include: {
        OrderDetail: true,
        payment: true,
      },
    });

    const res = await request(app)
      .put(`/api/orders/${notdeliveryorder.id}`)
      .send({
        clientName: "Nuevo Cliente",
        clientEmail: "nuevo@example.com",
        status: "paid",
      });
    console.log(res.body);
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/must have both payment and delivery/i);
  });

  it("debería retornar 400 si la orden está 'delivered'", async () => {
    vi.spyOn(OrderService, "getById").mockResolvedValue({
      ...setup.order,
      status: "delivered",
    });

    const res = await request(app).put(`/api/orders/${setup.order.id}`).send({
      clientName: "Test",
      clientEmail: "test@example.com",
      status: "pending",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/cannot be updated/i);
  });

  it("debería retornar 400 si la orden está 'pending' y se cambia trackingStatus", async () => {
    const res = await request(app).put(`/api/orders/${setup.order.id}`).send({
      clientName: "Test",
      clientEmail: "test@example.com",
      status: "pending",
      trackingStatus: "in_transit",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Cannot update tracking status/i);
  });

  it("debería retornar 400 si la orden está 'paid' con método distinto a zelle/venmo y se cambia a pending/cancelled", async () => {
    const otherPayment = await prisma.payment.create({
      data: { method: "Credit_Card", status: "approved" },
    });

    const otherDelivery = await prisma.delivery.create({
      data: { address: "Calle 456", city: "CABA", country: "Argentina" },
    });

    const paidOrder = await prisma.order.create({
      data: {
        client_name: "Paid Order",
        client_email: "paid@example.com",
        total: 200,
        status: "paid",
        id_payment: otherPayment.id,
        id_delivery: otherDelivery.id,
        OrderDetail: {
          create: [
            {
              product_name: "Producto pago",
              quantity: 1,
              price_unit: 200,
              product_image_url: "https://example.com/fake-paid.jpg",
            },
          ],
        },
      },
      include: {
        OrderDetail: true,
        payment: true,
        delivery: true,
      },
    });

    const res = await request(app).put(`/api/orders/${paidOrder.id}`).send({
      clientName: "Test",
      clientEmail: "test@example.com",
      status: "pending",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/cannot be changed to 'pending'/i);
  });
});
