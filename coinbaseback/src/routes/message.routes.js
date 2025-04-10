import { Router } from "express";
import { MessageController } from "../controllers/message.controller.js";


export const messageRouter = Router();

messageRouter.post("/", MessageController.create);
messageRouter.get("/", MessageController.getAll);
messageRouter.get("/:id", MessageController.getById);
messageRouter.delete("/:id", MessageController.delete);

