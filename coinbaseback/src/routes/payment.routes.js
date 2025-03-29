import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller.js";

export const paymentRouter = Router();

//Vamos a tener que agregarle los middlewares cuando el token al iniciar sesion funcione en el frontend, porque en el backend ya esta creado

paymentRouter.get("/", PaymentController.getAll);
paymentRouter.get("/:id_payment", PaymentController.getById);
paymentRouter.post("/", PaymentController.create);
paymentRouter.put("/:id_payment", PaymentController.update); 
paymentRouter.put("/:id_payment/status", PaymentController.updateStatus);
paymentRouter.delete("/:id_payment", PaymentController.delete);
