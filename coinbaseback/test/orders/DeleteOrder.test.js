import request from "supertest";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import "../mocks/SetupMocks.js";
import * as setup from "../helpers/setupsordertest.js";

let app;
let prisma;

describe("DELETE /api/orders/:id_order", () => {
  beforeAll(async () => {
    const appModule = await import("../../src/server.js");
    app = appModule.default;

    const prismaModule = await import("../../src/providers/prisma.provider.js");
    prisma = prismaModule.default;
  });

  it("debería eliminar la orden junto con su payment y delivery", async () => {
    // Act
    const res = await request(app).delete(`/api/orders/${setup.order.id}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);

    const orderDb = await prisma.order.findUnique({
      where: { id: setup.order.id },
    });
    const paymentDb = await prisma.payment.findUnique({
      where: { id: setup.payment.id },
    });
    const deliveryDb = await prisma.delivery.findUnique({
      where: { id: setup.delivery.id },
    });

    expect(orderDb).toBeNull();
    expect(paymentDb).toBeNull();
    expect(deliveryDb).toBeNull();
  });
  it("debería retornar 404 si la orden no existe", async () => {
    const res = await request(app).delete(`/api/orders/999999`);

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/Order Not Found/i);
  });
  it("Debe devolver 400 si el ID no es un número válido", async () => {
    const res = await request(app).delete("/api/orders/abc"); // ID inválido
    console.log(res.body);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toMatch(
      /el id de la orden debe ser un número válido/i
    );
  });
});
