import { ProductService } from "../services/product.service.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import {
  deleteFile,
  uploadFromBuffer,
} from "../services/googleStorage.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class ProductController {
  static async getAll(req, res) {
    try {
      const products = await ProductService.getAll();
      res.json(products);
    } catch (error) {
      res.status(500).json({
        error: "There was an error fetching the products",
        details: error.message,
      });
    }
  }

  static async getById(req, res) {
    const { id } = req.params;

    try {
      const product = await ProductService.getById(Number(id));

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({
        message: `Error fetching product: ${error.message}`,
      });
    }
  }

  static async create(req, res) {
    const { name, description, year, country_origin, price, stock } =
      req.validatedProduct;
    const file = req.file;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (req.file && !allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: "Unsupported image format." });
    }

    let image_url;

    try {
      image_url = await uploadFromBuffer(
        file.buffer,
        file.originalname,
        file.mimetype
      );
      const newProduct = await ProductService.create({
        name,
        description,
        year,
        country_origin,
        price,
        stock,
        image_url,
      });

      res.status(201).json({
        message: "Product created successfully",
        product: newProduct,
      });
    } catch (error) {
      if (image_url) {
        const filename = path.basename(image_url);
        await deleteFile(filename);
      }

      res.status(500).json({
        message: `Error creating product: ${error.message}`,
      });
    }
  }

  static async update(req, res) {
    const id_product = parseInt(req.params.id_product);
    const file = req.file;

    if (isNaN(id_product)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const { name, description, year, country_origin, price, stock } =
      req.validatedProduct;

    try {
      const existingProduct = await ProductService.getById(id_product);
      let image_url = existingProduct.image_url;
      if (req.file) {
        image_url = await uploadFromBuffer(
          file.buffer,
          file.originalname,
          file.mimetype
        );
      }
      
      const updatedProduct = await ProductService.update(id_product, {
        name,
        description,
        year,
        country_origin,
        price,
        stock,
        image_url,
      });
      res.json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: `Error updating product: ${error.message}` });
    }
  }

  static async delete(req, res) {
    const { id_product } = req.params;

    try {
      const product = await ProductService.getById(Number(id_product));

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const relatedOrder = await ProductService.relatedOrderDetailsCount(
        Number(id_product)
      );

      if (relatedOrder === 0 && product.image_url) {
        const fileName = path.basename(product.image_url);
        try {
          await deleteFile(fileName); // Elimina la imagen del bucket
          console.log("✅ Imagen eliminada de GCS:", fileName);
        } catch (err) {
          console.error(
            "⚠️ No se pudo eliminar la imagen de GCS:",
            err.message
          );
        }
      }

      await ProductService.delete(Number(id_product));

      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({
        message: `Error deleting product: ${error.message}`,
      });
    }
  }
}
