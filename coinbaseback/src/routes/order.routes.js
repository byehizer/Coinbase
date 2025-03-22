import { Router } from "express";
import { OrderController } from "../controllers/order.controller.js";

export const orderRouter = Router();

//Chequear que las rutas coincidan con las rutas que pusimos en el front y agregar el middleware que necesite. (Por eso comento las rutas)
/*
orderRouter.get("/", OrderController.getAll);
orderRouter.get("/:id_order", OrderController.getById);
orderRouter.post("/", OrderController.create);
orderRouter.put("/:id_order/status", OrderController.updateStatus);
orderRouter.put("/:id_order", OrderController.update);
orderRouter.delete("/:id_order", OrderController.delete);
*/