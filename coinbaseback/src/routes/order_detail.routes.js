import { Router } from 'express';
import { OrderDetailController } from "../controllers/order_detail.controller.js";

export const orderDetailRouter = Router();


//Chequear que las rutas coincidan con las rutas que pusimos en el front y agregar el middleware que necesite. (Por eso comento las rutas)
/*
orderDetailRouter.get("/", OrderDetailController.getAll);
orderDetailRouter.get("/:id_order_detail", OrderDetailController.getById);
orderDetailRouter.post("/", OrderDetailController.create);
orderDetailRouter.put("/:id_order_detail", OrderDetailController.update);
orderDetailRouter.delete("/:id_order_detail", OrderDetailController.delete);

*/
