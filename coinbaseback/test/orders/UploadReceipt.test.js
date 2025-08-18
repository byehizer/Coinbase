import "../mocks/SetupMocks.js";
import request from "supertest";
import path from "path";
import { fileURLToPath } from "url";
import * as setup from "../helpers/setupsordertest.js";
import { PaymentService } from "../../src/services/payment.service.js";
import { OrderService } from "../../src/services/order.service.js";

let app;
let prisma;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("POST /api/orders/:id/upload-receipt", () => {
  const filePath = path.join(__dirname, "../mocks", "test.jpg");

  beforeAll(async () => {
    const appModule = await import("../../src/server.js");
    app = appModule.default;

    const prismaModule = await import("../../src/providers/prisma.provider.js");
    prisma = prismaModule.default;
  });

  it("→ 400 si falta el email", async () => {
    const res = await request(app)
      .post(`/api/orders/${setup.order.id}/upload-receipt`)
      .attach("image", filePath); // solo archivo, sin email

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Email is required");
  });

  it("→ 400 si no se envía archivo", async () => {
    const res = await request(app)
      .post(`/api/orders/${setup.order.id}/upload-receipt`)
      .field("email", "test@example.com");

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("No file uploaded");
  });

  it("→ 404 si la orden no existe", async () => {
    vi.spyOn(OrderService, "getById").mockResolvedValue(null);

    const res = await request(app)
      .post(`/api/orders/999999/upload-receipt`)
      .field("email", "test@example.com")
      .attach("image", filePath);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Order not found");
  });

  it("→ 403 si el email no coincide", async () => {
    vi.spyOn(OrderService, "getById").mockResolvedValue({
      client_email: "otro@example.com",
    });

    const res = await request(app)
      .post(`/api/orders/${setup.order.id}/upload-receipt`)
      .field("email", "test@example.com")
      .attach("image", filePath);

    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Unauthorized: Email does not match order");
  });

  it("→ 404 si el pago no existe", async () => {
    vi.spyOn(OrderService, "getById").mockResolvedValue({
      client_email: "test@example.com",
    });
    vi.spyOn(PaymentService, "findByOrderId").mockResolvedValue(null);

    const res = await request(app)
      .post(`/api/orders/${setup.order.id}/upload-receipt`)
      .field("email", "test@example.com")
      .attach("image", filePath);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Payment not found");
  });

  it("→ 400 si el pago no está pendiente", async () => {
    vi.spyOn(OrderService, "getById").mockResolvedValue({
      client_email: "test@example.com",
    });
    vi.spyOn(PaymentService, "findByOrderId").mockResolvedValue({ status: "approved" });

    const res = await request(app)
      .post(`/api/orders/${setup.order.id}/upload-receipt`)
      .field("email", "test@example.com")
      .attach("image", filePath);

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Current payment status: approved/);
  });

  it("→ 200 si se sube correctamente", async () => {
    vi.spyOn(OrderService, "getById").mockResolvedValue({
      client_email: "test@example.com",
    });
    vi.spyOn(PaymentService, "findByOrderId").mockResolvedValue({ status: "pending" });

    const res = await request(app)
      .post(`/api/orders/${setup.order.id}/upload-receipt`)
      .field("email", "test@example.com")
      .attach("image", filePath);
    expect(res.status).toBe(200);
    expect(res.body.receipt).toBe("https://fake-url.com/img.jpg");
  });
});
