import { Router } from "express";
import { OrderController } from "../controllers/order.controller.js";

export const orderRouter = Router();

//Vamos a tener que agregarle los middlewares cuando el token al iniciar sesion funcione en el frontend, porque en el backend ya esta creado

orderRouter.get("/", OrderController.getAll);
orderRouter.get("/:id_order", OrderController.getById);
orderRouter.post("/", OrderController.create);
orderRouter.put("/:id_order/status", OrderController.updateStatus);
orderRouter.put("/:id_order", OrderController.update);
orderRouter.delete("/:id_order", OrderController.delete);
