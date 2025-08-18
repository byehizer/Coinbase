import request from "supertest";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import "../mocks/SetupMocks.js";
import * as setup from "../helpers/setupsordertest.js";

let app;
let prisma;

describe("Create Order tests", () =>{
    beforeAll(async () => {
    const appModule = await import("../../src/server.js");
    app = appModule.default;

    const prismaModule = await import("../../src/providers/prisma.provider.js");
    prisma = prismaModule.default;
  });

    it("POST /orders - debería crear una orden válida", async () => {
      const orderData = {
        client_name: "Juan Pérez",
        client_email: "juan@example.com",
        total: 100.5,
        payment_method: "Zelle",
        address: "Calle 123",
        city: "Bogotá",
        country: "Colombia",
        items: [
          {
            id: setup.product.id,
            name: setup.product.name,
            quantity: 2,
            price: 100,
            image_url: "https://fake-url.com/test.jpg",
          },
        ],
      };
  
      const res = await request(app).post("/api/orders").send(orderData);
      expect(res.status).toBe(201);
      expect(res.body.order).toHaveProperty("id");
      expect(res.body.message).toBe("Order created successfully");
    });
});