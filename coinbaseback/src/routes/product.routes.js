import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";

export const productRouter = Router();

//Chequear que las rutas coincidan con las rutas que pusimos en el front y agregar el middleware que necesite. (Por eso comento las rutas)
/*
productRouter.get("/", ProductController.getAll); 
productRouter.get("/:id_product", ProductController.getById); 
productRouter.post("/", ProductController.create);
productRouter.put("/:id_product", ProductController.update); 
productRouter.delete("/:id_product", ProductController.delete);
*/