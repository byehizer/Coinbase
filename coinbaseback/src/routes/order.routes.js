import { Router } from "express";
import { OrderController } from "../controllers/order.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorization } from "../middlewares/authorization.js";
import upload from "../middlewares/upload.js";

export const orderRouter = Router();

//Vamos a tener que agregarle los middlewares cuando el token al iniciar sesion funcione en el frontend, porque en el backend ya esta creado

orderRouter.get("/", authenticate, authorization("admin"), OrderController.getAll);
orderRouter.get("/:id_order", OrderController.getById);
orderRouter.post("/", OrderController.create);
orderRouter.put(
  "/:id_order/status",
  authenticate,
  authorization("admin"),
  OrderController.updateStatus
);
orderRouter.put(
  "/:id_order",
  authenticate,
  authorization("admin"),
  OrderController.update
);
orderRouter.delete(
  "/:id_order",
  authenticate,
  authorization("admin"),
  OrderController.delete
);
orderRouter.patch("/:id/accept", authenticate, authorization("admin"), OrderController.approveOrder);
orderRouter.patch("/:id/reject", authenticate, authorization("admin"), OrderController.rejectOrder);
orderRouter.patch("/:orderId/refund",  authenticate, authorization("admin"),OrderController.refund);
orderRouter.post("/:id/upload-receipt", upload.single("image"), OrderController.uploadReceipt);
