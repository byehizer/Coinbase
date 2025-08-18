import { CreateOrderSchema, updateOrderSchema, OrderItemSchema } from "../../src/schemas/order.schema.js";

describe("OrderItemSchema", () => {
  it("valida un item válido", () => {
    const item = {
      id: 1,
      name: "Producto 1",
      quantity: 2,
      price: 10.5,
      image_url: "https://example.com/image.jpg",
    };

    const result = OrderItemSchema.safeParse(item);
    expect(result.success).toBe(true);
  });

  it("falla si falta un campo", () => {
    const item = {
      id: 1,
      name: "Producto 1",
      quantity: 2,
      price: 10.5,
      // falta image_url
    };

    const result = OrderItemSchema.safeParse(item);
    expect(result.success).toBe(false);
  });
});

describe("CreateOrderSchema", () => {
  const validOrder = {
    client_name: "Juan Pérez",
    client_email: "juan@example.com",
    total: 100,
    payment_method: "Zelle",
    address: "Calle Falsa 123",
    city: "Buenos Aires",
    country: "Argentina",
    items: [
      {
        id: 1,
        name: "Producto 1",
        quantity: 1,
        price: 50,
        image_url: "https://example.com/image.jpg",
      },
    ],
  };

  it("valida una orden válida", () => {
    const result = CreateOrderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it("falla si falta el email", () => {
    const invalid = { ...validOrder, client_email: "" };
    const result = CreateOrderSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("falla si items está vacío", () => {
    const invalid = { ...validOrder, items: [] };
    const result = CreateOrderSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("falla si el país contiene números", () => {
    const invalid = { ...validOrder, country: "Arg3nt1na" };
    const result = CreateOrderSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe("updateOrderSchema", () => {
  it("valida una actualización mínima válida", () => {
    const update = {
      clientName: "Pedro",
      clientEmail: "pedro@example.com",
    };

    const result = updateOrderSchema.safeParse(update);
    expect(result.success).toBe(true);
  });

  it("valida una actualización completa válida", () => {
    const update = {
      clientName: "Pedro",
      clientEmail: "pedro@example.com",
      status: "shipped",
      trackingStatus: "in_transit",
      deliveryAddress: "Av. Siempre Viva 742",
      deliveryCity: "Springfield",
      deliveryCountry: "USA",
    };

    const result = updateOrderSchema.safeParse(update);
    expect(result.success).toBe(true);
  });

  it("falla con un email inválido", () => {
    const update = {
      clientName: "Pedro",
      clientEmail: "noesunemail",
    };

    const result = updateOrderSchema.safeParse(update);
    expect(result.success).toBe(false);
  });

  it("falla con un status inválido", () => {
    const update = {
      clientName: "Pedro",
      clientEmail: "pedro@example.com",
      status: "unknown",
    };

    const result = updateOrderSchema.safeParse(update);
    expect(result.success).toBe(false);
  });
});
