import { beforeAll, afterAll, beforeEach, afterEach } from "vitest";
import prisma from "../../src/providers/prisma.provider.js";
import request from "supertest";

let order, payment, delivery, product;

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  payment = await prisma.payment.create({
    data: {
      method: "Zelle",
      status: "pending",
    },
  });

  delivery = await prisma.delivery.create({
    data: {
      address: "Tucuman 2000",
      city: "CABA",
      country: "Argetina",
    },
  });

  order = await prisma.order.create({
    data: {
      client_name: "Juan Test",
      client_email: "juan.test@example.com",
      total: 123.45,
      status: "pending",
      id_payment: payment.id,
      id_delivery: delivery.id,
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
      delivery: true,
    },
  });

  product = await prisma.product.create({
    data: {
      name: "Producto Test",
      description: "Test description",
      year: 2020,
      country_origin: "Argentina",
      price: 100,
      stock: 10,
      image_url: "https://fake-url.com/test.jpg",
    },
  });
});

afterEach(async () => {
  await prisma.orderDetail.deleteMany(); // primero detalles
  await prisma.order.deleteMany();       // luego orden
  await prisma.delivery.deleteMany();    // luego delivery
  await prisma.payment.deleteMany();     // luego payment
  await prisma.product.deleteMany();     // por último productos independientes
  vi.restoreAllMocks();
});

afterAll(async () => {
  await prisma.$disconnect();
});

export { order, payment, delivery, product };
