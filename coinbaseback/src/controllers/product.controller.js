import { ProductService } from "../services/product.service.js";

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
        const { id_product } = req.params;

        try {
            const product = await ProductService.getById(Number(id_product));

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
        const { name, description, year, country_origin, price, stock, image_url } = req.body;

        try {
            const newProduct = await ProductService.create({
                name,
                description,
                year,
                country_origin,
                price,
                stock,
                image_url
            });

            res.status(201).json({
                message: "Product created successfully",
                product: newProduct,
            });
        } catch (error) {
            res.status(500).json({
                message: `Error creating product: ${error.message}`,
            });
        }
    }

    static async update(req, res) {
        const { id_product } = req.params;
        const { name, description, year, country_origin, price, stock, image_url } = req.body;

        try {
            const updatedProduct = await ProductService.update(id_product, {
                name,
                description,
                year,
                country_origin,
                price,
                stock,
                image_url
            });

            res.json({
                message: "Product updated successfully",
                product: updatedProduct,
            });
        } catch (error) {
            res.status(500).json({
                message: `Error updating product: ${error.message}`,
            });
        }
    }

    static async delete(req, res) {
        const { id_product } = req.params;

        try {
            await ProductService.delete(Number(id_product));

            res.json({
                message: "Product deleted successfully",
            });
        } catch (error) {
            res.status(500).json({
                message: `Error deleting product: ${error.message}`,
            });
        }
    }
}
