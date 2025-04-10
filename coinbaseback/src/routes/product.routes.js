import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";

export const productRouter = Router();

//Vamos a tener que agregarle los middlewares cuando el token al iniciar sesion funcione en el frontend, porque en el backend ya esta creado


productRouter.get("/", ProductController.getAll); 
productRouter.get("/:id_product", ProductController.getById); 
productRouter.post("/", ProductController.create);
productRouter.put("/:id_product", ProductController.update); 
productRouter.delete("/:id_product", ProductController.delete);