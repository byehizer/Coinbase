import { productSchema } from "../schemas/product.schema.js";
import fs from "fs/promises";

export async function validateProduct(req, res, next) {
  try {
    const validated = productSchema.parse(req.body);
    req.validatedProduct = validated;
    return next();
  } catch (error) {
    return res.status(400).json({
      message: "Validation error",
      errors: error.errors?.map((e) => e.message) || [error.message],
    });
  }
}
