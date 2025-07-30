import { Router } from "express";
import { MessageController } from "../controllers/message.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorization } from "../middlewares/authorization.js";

export const messageRouter = Router();

messageRouter.post("/", MessageController.create);
messageRouter.get(
  "/",
  authenticate,
  authorization("admin"),
  MessageController.getAll
);
messageRouter.get(
  "/:id",
  authenticate,
  authorization("admin"),
  MessageController.getById
);
messageRouter.delete(
  "/:id",
  authenticate,
  authorization("admin"),
  MessageController.delete
);
