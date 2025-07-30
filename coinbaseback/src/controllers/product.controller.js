import { ProductService } from "../services/product.service.js";
import fs from "fs/promises";
import path from "path";

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
    const { name, description, year, country_origin, price, stock } = req.body;
    const image_url = `/uploads/${req.file.filename}`;
    const parsedYear = parseInt(year, 10);
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock, 10);

    if (isNaN(parsedYear) || isNaN(parsedPrice) || isNaN(parsedStock)) {
      if (req.file?.path) {
        try {
          await fs.unlink(req.file.path);
        } catch (err) {
          console.error(
            "Error deleting file after failed validation:",
            err.message
          );
        }
      }

      return res.status(400).json({
        message: "Invalid input: year, price, and stock must be valid numbers.",
      });
    }

    try {
      const newProduct = await ProductService.create({
        name,
        description,
        year: parsedYear,
        country_origin,
        price: parsedPrice,
        stock: parsedStock,
        image_url,
      });

      res.status(201).json({
        message: "Product created successfully",
        product: newProduct,
      });
    } catch (error) {
      if (req.file?.path) {
        try {
          await fs.unlink(req.file.path);
        } catch (err) {
          console.error("Error deleting file after failure:", err.message);
        }
      }
      res.status(500).json({
        message: `Error creating product: ${error.message}`,
      });
    }
  }

  static async update(req, res) {
    const id_product = parseInt(req.params.id_product, 10);
    const { name, description, year, country_origin, price, stock } = req.body;

    try {
      const existingProduct = await ProductService.getById(id_product);
      let image_url = existingProduct.image_url;
      if (req.file) {
        image_url = `/uploads/${req.file.filename}`;

        if (existingProduct.image_url) {
          const oldImagePath = path.join(
            "uploads",
            path.basename(existingProduct.image_url)
          );
          await fs.unlink(oldImagePath).catch((err) => {
            console.error("Error deleting old image:", err.message);
          });
        }
      }

      const updatedProduct = await ProductService.update(id_product, {
        name,
        description,
        year: parseInt(year),
        country_origin,
        price: parseFloat(price),
        stock: parseInt(stock),
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

      const relatedOrder= await ProductService.relatedOrderDetailsCount(Number(id_product));

   if (relatedOrder === 0 && product.image_url) {
      const imagePath = path.join("uploads", path.basename(product.image_url));
      try {
        await fs.unlink(imagePath);
        console.log("Imagen eliminada:", imagePath);
      } catch (err) {
        console.error("No se pudo eliminar la imagen:", err.message);
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
