import request from "supertest";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import "../mocks/SetupMocks.js";
import * as setup from "../helpers/setupsordertest.js";

let app;
let prisma;

describe("Get Orders Tests", () => {
  beforeAll(async () => {
    const appModule = await import("../../src/server.js");
    app = appModule.default;

    const prismaModule = await import("../../src/providers/prisma.provider.js");
    prisma = prismaModule.default;
  });

  it("GET /orders - debería retornar todas las órdenes", async () => {
    const res = await request(app).get("/api/orders");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("GET /orders/:id - debería retornar una orden específica", async () => {
    const res = await request(app).get(`/api/orders/${setup.order.id}`);

    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(setup.order.id);
    expect(res.body.clientName).toBe("Juan Test");
  });

  it("GET /orders/:id - debería retornar 404 si la orden no existe", async () => {
    const res = await request(app).get("/api/orders/99999");

    console.log(res.body);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Order not found");
  });
});
