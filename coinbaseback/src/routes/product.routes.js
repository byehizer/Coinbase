import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorization } from "../middlewares/authorization.js";
import upload from "../middlewares/upload.js";
import { validateProduct } from "../middlewares/validateProducts.js";

export const productRouter = Router();

//Vamos a tener que agregarle los middlewares cuando el token al iniciar sesion funcione en el frontend, porque en el backend ya esta creado

productRouter.get("/", ProductController.getAll);
productRouter.get("/:id", ProductController.getById);
productRouter.post(
  "/",
  authenticate,
  authorization("admin"),
  upload.single("image"),
  async (req, res, next) => {
    try {
      await validateProduct(req, res, next);
    } catch (error) {
      next(error);
    } 
  },
  ProductController.create
);
productRouter.put(
  "/:id_product",
  authenticate,
  authorization("admin"),
  upload.single("image"),
  async (req, res, next) => {
    try {
      await validateProduct(req, res, next);
    } catch (error) {
      next(error);
    }
  },
  ProductController.update
);
productRouter.delete(
  "/:id_product",
  authenticate,
  authorization("admin"),
  ProductController.delete
);
