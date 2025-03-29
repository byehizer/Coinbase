import { Router } from 'express';
import { OrderDetailController } from "../controllers/order_detail.controller.js";

export const orderDetailRouter = Router();


//Vamos a tener que agregarle los middlewares cuando el token al iniciar sesion funcione en el frontend, porque en el backend ya esta creado

orderDetailRouter.get("/", OrderDetailController.getAll);
orderDetailRouter.get("/:id_order_detail", OrderDetailController.getById);
orderDetailRouter.post("/", OrderDetailController.create);
orderDetailRouter.put("/:id_order_detail", OrderDetailController.update);
orderDetailRouter.delete("/:id_order_detail", OrderDetailController.delete);

