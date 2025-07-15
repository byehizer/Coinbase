import { Router } from "express";
import { OrderController } from "../controllers/order.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorization } from "../middlewares/authorization.js";

export const orderRouter = Router();

//Vamos a tener que agregarle los middlewares cuando el token al iniciar sesion funcione en el frontend, porque en el backend ya esta creado

orderRouter.get("/", authenticate, authorization("admin"), OrderController.getAll);
orderRouter.get("/:id_order", OrderController.getById);
orderRouter.post("/", OrderController.create);
orderRouter.put(
  "/:id_order/status",
  authenticate,
  authorization,
  OrderController.updateStatus
);
orderRouter.put(
  "/:id_order",
  authenticate,
  authorization,
  OrderController.update
);
orderRouter.delete(
  "/:id_order",
  authenticate,
  authorization,
  OrderController.delete
);
orderRouter.post("/orders/:id/approve", OrderController.approveOrder);
orderRouter.post("/orders/:id/reject", OrderController.rejectOrder);
