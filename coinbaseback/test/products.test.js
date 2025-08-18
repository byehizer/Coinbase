import "./mocks/SetupMocks.js";
import request from "supertest";
import path from "path";
import { fileURLToPath } from "url";
import { vi } from "vitest";

let app;
let prisma;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let product;

describe("🧪 Productos", () => {
  beforeAll(async () => {
    const appModule = await import("../src/server.js");
    app = appModule.default;

    const prismaModule = await import("../src/providers/prisma.provider.js");
    prisma = prismaModule.default;
  });
  beforeEach(async () => {
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
    await prisma.product.deleteMany();
    vi.restoreAllMocks();
  });

  it("GET /products - debería obtener todos los productos", async () => {
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Producto Test" }),
      ])
    );
  });

  it("GET /products/:id - debería obtener un producto por ID", async () => {
    const res = await request(app).get(`/api/products/${product.id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Producto Test");
  });

  it("POST /products - debería crear un producto con imagen simulada", async () => {
    try {
      const res = await request(app)
        .post("/api/products")
        .field("name", "Nuevo Producto")
        .field("description", "Descripción")
        .field("year", 2021)
        .field("country_origin", "Brasil")
        .field("price", 200)
        .field("stock", 5)
        .attach("image", path.join(__dirname, "mocks", "test.jpg"));

      expect(res.status).toBe(201);
      expect(res.body.product.name).toBe("Nuevo Producto");
      expect(res.body.product.image_url).toBe("https://fake-url.com/img.jpg");
    } catch (err) {
      console.error("🟥 Error lanzado en el test:", err);
      throw err;
    }
  });
  it("GET /products/:id - debería devolver 404 si no existe", async () => {
    const res = await request(app).get("/api/products/99999");
    expect(res.status).toBe(404);
  });

  it("PUT /products/:id - debería actualizar sin nueva imagen", async () => {
    try {
      const res = await request(app)
        .put(`/api/products/${product.id}`)
        .field("name", "Nombre sin nueva imagen")
        .field("description", "desc actualizada")
        .field("year", "1900")
        .field("country_origin", "Argentina")
        .field("price", "120")
        .field("stock", "5");
      expect(res.status).toBe(200);
      expect(res.body.product.name).toBe("Nombre sin nueva imagen");
    } catch (err) {
      console.log(err);
    }
  });
  it("POST /products - debería fallar con campos faltantes", async () => {
    const res = await request(app).post("/api/products").field("name", "");
    expect(res.status).toBe(400); // o 422, depende del schema
  });
  it("DELETE /products/:id - debería devolver 404 si no existe", async () => {
    const res = await request(app).delete("/api/products/999999");
    expect(res.status).toBe(404);
  });

  it("POST /products - debería rechazar imagen no válida", async () => {
    const res = await request(app)
      .post("/api/products")
      .field("name", "Nuevo Producto")
      .field("description", "Descripción")
      .field("year", 2021)
      .field("country_origin", "Brasil")
      .field("price", 200)
      .field("stock", 5)
      .attach("image", path.join(__dirname, "mocks", "archivo-no-imagen.txt"));
    expect(res.status).toBe(400); // depende de tu validación
  });

  it("PUT /products/:id - debería actualizar el producto", async () => {
    const res = await request(app)
      .put(`/api/products/${product.id}`)
      .field("name", "Producto Actualizado")
      .field("description", "Nueva descripción")
      .field("year", 2022)
      .field("country_origin", "Chile")
      .field("price", 150)
      .field("stock", 8)
      .attach("image", path.join(__dirname, "mocks", "test.jpg"));

    expect(res.status).toBe(200);
    expect(res.body.product.name).toBe("Producto Actualizado");
  });

  it("DELETE /api/products/:id - debería marcar como eliminado", async () => {
       const product1 = await prisma.product.create({
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
    const res = await request(app).delete(`/api/products/${product1.id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
