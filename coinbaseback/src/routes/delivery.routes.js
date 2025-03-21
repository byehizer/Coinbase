import { Router } from 'express';
import { DeliveryController } from "../controllers/delivery.controller.js";
import { authenticate, authorization } from "../middleware/auth.js"; 

export const deliveryRouter = Router();


//Chequear que las rutas coincidan con las rutas que pusimos en el front y agregar el middleware que necesite. (Por eso comento las rutas)
/*
deliveryRouter.get("/", authenticate, authorization, DeliveryController.getAll);
deliveryRouter.get("/:id_delivery", authenticate, authorization, DeliveryController.getById);
deliveryRouter.post("/", authenticate, authorization, DeliveryController.create);
deliveryRouter.put("/:id_delivery/status", authenticate, authorization, DeliveryController.updateStatus);
*/


