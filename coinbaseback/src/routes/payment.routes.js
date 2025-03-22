import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller.js";

export const paymentRouter = Router();

//Chequear que las rutas coincidan con las rutas que pusimos en el front y agregar el middleware que necesite. (Por eso comento las rutas)
/*
paymentRouter.get("/", PaymentController.getAll);
paymentRouter.get("/:id_payment", PaymentController.getById);
paymentRouter.post("/", PaymentController.create);
paymentRouter.put("/:id_payment", PaymentController.update); 
paymentRouter.put("/:id_payment/status", PaymentController.updateStatus);
paymentRouter.delete("/:id_payment", PaymentController.delete);
*/