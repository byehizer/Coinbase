import { Router } from 'express';
import { OrderDetailController } from "../controllers/order_detail.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorization } from "../middlewares/authorization.js";

export const orderDetailRouter = Router();


//Vamos a tener que agregarle los middlewares cuando el token al iniciar sesion funcione en el frontend, porque en el backend ya esta creado


orderDetailRouter.get(
  "/",
  authenticate,
  authorization("admin"),
  OrderDetailController.getAll
);

orderDetailRouter.get(
  "/:id_order_detail",
  authenticate,
  authorization("admin"),
  OrderDetailController.getById
);

orderDetailRouter.post(
  "/",
  authenticate,
  authorization("admin"),
  OrderDetailController.create
);

orderDetailRouter.put(
  "/:id_order_detail",
  authenticate,
  authorization("admin"),
  OrderDetailController.update
);

orderDetailRouter.delete(
  "/:id_order_detail",
  authenticate,
  authorization("admin"),
  OrderDetailController.delete
);


