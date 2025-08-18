import request from "supertest";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import "../mocks/SetupMocks.js";
import * as setup from "../helpers/setupsordertest.js";
import { OrderService } from "../../src/services/order.service.js";
import { ProductService } from "../../src/services/product.service.js";

let app;
let prisma;

describe("PATCH /orders/:id/reject Reject Order test", () => {
  beforeAll(async () => {
    const appModule = await import("../../src/server.js");
    app = appModule.default;

    const prismaModule = await import("../../src/providers/prisma.provider.js");
    prisma = prismaModule.default;
  });

  it("404 si no existe la orden", async () => {
    const res = await request(app).patch("/api/orders/999/reject");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Order not found");
  });
  it("400 si orden no está pending", async () => {
    vi.spyOn(OrderService, "getById").mockResolvedValue({
      ...setup.order,
      status: "paid",
    });

    const res = await request(app).patch(
      `/api/orders/${setup.order.id}/accept`
    );

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Order is not pending");
  });

  it(" 200 en éxito", async () => {
    vi.spyOn(OrderService, "getById").mockResolvedValue({
      ...setup.order,
      status: "pending",
      OrderDetail: [
        {
          id_product: setup.product.id,
          quantity: 1,
          product_name: setup.product.name,
        },
      ],
    });

    const res = await request(app).patch(
      `/api/orders/${setup.order.id}/reject`
    );

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Order rejected.");
  });

    it("→ 500 si ocurre un error inesperado", async () => {
    vi.spyOn(OrderService, "getById").mockRejectedValue(new Error("DB fail"));

    const res = await request(app)
      .patch(`/api/orders/${setup.order.id}/reject`);

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Failed to reject order");
  });
});
