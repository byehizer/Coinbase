import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";
import { authorization } from "../middlewares/authorization.js";
import { authenticate } from "../middlewares/authenticate.js";

export const productRouter = Router();

//Vamos a tener que agregarle los middlewares cuando el token al iniciar sesion funcione en el frontend, porque en el backend ya esta creado

productRouter.get("/", ProductController.getAll);
productRouter.get("/:id_product", ProductController.getById);
productRouter.post("/", authenticate, authorization, ProductController.create);
productRouter.put(
  "/:id_product",
  authenticate,
  authorization,
  ProductController.update
);
productRouter.delete(
  "/:id_product",
  authenticate,
  authorization,
  ProductController.delete
);
