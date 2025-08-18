import request from "supertest";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import "../mocks/SetupMocks.js";
import * as setup from "../helpers/setupsordertest.js";
import { OrderService } from "../../src/services/order.service.js";

let app;
let prisma;

describe("POST /api/orders/public/:id", () => {
  beforeAll(async () => {
    const appModule = await import("../../src/server.js");
    app = appModule.default;

    const prismaModule = await import("../../src/providers/prisma.provider.js");
    prisma = prismaModule.default;
  });

  it("→ 200 si el email coincide con la orden", async () => {
   const  payment1 = await prisma.payment.create({
      data: {
        method: "Zelle",
        status: "pending",
      },
    });

    const delivery1 = await prisma.delivery.create({
      data: {
        address: "Tucuman 2000",
        city: "CABA",
        country: "Argetina",
      },
    });

   const order1 = await prisma.order.create({
      data: {
        client_name: "Juan Test",
        client_email: "juan.test@example.com",
        total: 123.45,
        status: "pending",
        id_payment: payment1.id,
        id_delivery: delivery1.id,
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
    const res = await request(app)
      .post(`/api/orders/public/${order1.id}`)
      .send({ email: "juan.test@example.com" });

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(order1.id);
    expect(res.body.products).toHaveLength(1);
  });

  it("→ 403 si el email no coincide o la orden no existe", async () => {
    const res1 = await request(app)
      .post("/api/orders/public/9999")
      .send({ email: "wrong@example.com" });

    expect(res1.status).toBe(403);
    expect(res1.body.message).toBe("No autorizado");

    vi.spyOn(OrderService, "getById").mockResolvedValue({
      id: 2,
      client_email: "real@example.com",
      OrderDetail: [],
    });

    const res2 = await request(app)
      .post("/api/orders/public/2")
      .send({ email: "wrong@example.com" });

    expect(res2.status).toBe(403);
    expect(res2.body.message).toBe("No autorizado");
  });
});
