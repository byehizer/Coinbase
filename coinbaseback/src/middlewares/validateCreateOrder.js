import { CreateOrderSchema } from "../schemas/order.schema.js";
import { ProductService } from "../services/product.service.js";

export async function validateCreateOrder(req, res, next) {
  try {
    // Validación estructural con Zod
    const validatedData = CreateOrderSchema.parse(req.body);

    // Validación contra productos reales
    for (const item of validatedData.items) {
      const product = await ProductService.getById(item.id);
      if (!product) {
        return res.status(400).json({ error: `Product with ID ${item.id} not found` });
      }

      if (
        product.name !== item.name ||
        Math.abs(product.price - item.price) > 0.01 ||
        product.image_url !== item.image_url
      ) {
        return res.status(400).json({
          error: `Product data mismatch for ID ${item.id}`,
          expected: {
            name: product.name,
            price: product.price,
            image_url: product.image_url,
          },
          received: {
            name: item.name,
            price: item.price,
            image_url: item.image_url,
          },
        });
      }
    }

    // Todo OK
    next();
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({
        error: "Validation failed",
        issues: err.errors.map((e) => ({ field: e.path[0], message: e.message })),
      });
    }

    return res.status(500).json({ error: "Internal validation error" });
  }
}
