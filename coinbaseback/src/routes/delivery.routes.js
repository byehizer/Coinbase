import { Router } from "express";
import { DeliveryController } from "../controllers/delivery.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorization } from "../middlewares/authorization.js";

export const deliveryRouter = Router();

//Vamos a tener que agregarle los middlewares cuando el token al iniciar sesion funcione en el frontend, porque en el backend ya esta creado

/*deliveryRouter.get(
  "/",
  authenticate,
  authorization("admin"),
  DeliveryController.getAll
);
deliveryRouter.get(
  "/:id_delivery",
  authenticate,
  authorization("admin"),
  DeliveryController.getById
);
deliveryRouter.post(
  "/",
  authenticate,
  authorization("admin"),
  DeliveryController.create
);
deliveryRouter.put(
  "/:id_delivery/status",
  authenticate,
  authorization("admin"),
  DeliveryController.updateStatus
);
deliveryRouter.put(
  "/:id_delivery",
  authenticate,
  authorization("admin"),
  DeliveryController.update
);
deliveryRouter.delete(
  "/:id_delivery",
  authenticate,
  authorization("admin"),
  DeliveryController.delete
);*/
