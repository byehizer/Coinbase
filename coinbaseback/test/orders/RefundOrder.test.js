import { vi } from "vitest";
vi.mock("stripe", () => {
  const fakeRefund = { id: "re_123", status: "succeeded" };
  const refundsCreateMock = vi.fn().mockResolvedValue(fakeRefund);
  const mockStripe = vi.fn().mockImplementation(() => ({
    refunds: {
      create: refundsCreateMock,
    },
  }));
  return { default: mockStripe };
});

import request from "supertest";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import "../mocks/SetupMocks.js";
import * as setup from "../helpers/setupsordertest.js";
import Stripe from "stripe";
import { OrderService } from "../../src/services/order.service.js";

let app;
let prisma;

const stripe = new Stripe("fake-key");

describe("PATCH /orders/:Orderid/refund Refund Order test", () => {
  beforeAll(async () => {
    const appModule = await import("../../src/server.js");
    app = appModule.default;

    const prismaModule = await import("../../src/providers/prisma.provider.js");
    prisma = prismaModule.default;
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("→ 404 si la orden no existe o no tiene chargeId válido", async () => {
    const res = await request(app).patch("/api/orders/999/refund");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("No se encontró el pago válido para reembolso");
  });

  it("→ 400 si la orden ya fue reembolsada", async () => {
    vi.spyOn(OrderService, "getById").mockResolvedValue({
      ...setup.order,
      payment: { chargeId: "ch_123", status: "refunded" },
    });

    const res = await request(app).patch(
      `/api/orders/${setup.order.id}/refund`
    );

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("La orden ya fue reembolsada");
  });
  it("→ 200 si el reembolso se inicia correctamente", async () => {
    const fakeRefund = { id: "re_123", status: "succeeded" };

    // Mock de OrderService.getById
    vi.spyOn(OrderService, "getById").mockResolvedValue({
      ...setup.order,
      payment: { chargeId: "ch_123", status: "approved" },
    });

    stripe.refunds.create.mockResolvedValue(fakeRefund);

    const res = await request(app)
      .patch(`/api/orders/${setup.order.id}/refund`)
      .set("Authorization", "Bearer fake-admin-token");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Reembolso iniciado");
    expect(res.body.refund).toEqual(fakeRefund);
    expect(stripe.refunds.create).toHaveBeenCalledWith({
      charge: "ch_123",
    });
  });

  it("→ 500 si ocurre un error inesperado", async () => {
    vi.spyOn(OrderService, "getById").mockRejectedValue(new Error("DB fail"));

    const res = await request(app)
      .patch(`/api/orders/${setup.order.id}/refund`)
      .set("Authorization", "Bearer fake-admin-token");

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Error al procesar el reembolso");
  });
});
