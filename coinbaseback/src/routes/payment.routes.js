import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller.js";
import upload from "../middlewares/upload.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorization } from "../middlewares/authorization.js";

export const paymentRouter = Router();

//Vamos a tener que agregarle los middlewares cuando el token al iniciar sesion funcione en el frontend, porque en el backend ya esta creado

/*paymentRouter.get("/", authenticate, authorization("admin"), PaymentController.getAll);
paymentRouter.get("/:id_payment", authenticate, authorization("admin"), PaymentController.getById);
paymentRouter.post("/", upload.single("receipt") ,PaymentController.create);
paymentRouter.put("/:id_payment", authenticate, authorization("admin"), PaymentController.update); 
paymentRouter.put("/:id_payment/status", authenticate, authorization("admin"), PaymentController.updateStatus);
paymentRouter.delete("/:id_payment", authenticate, authorization("admin"), PaymentController.delete);*/
