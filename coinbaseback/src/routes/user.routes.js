import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorization } from "../middlewares/authorization.js";

export const usersRouter = Router();


usersRouter.get("/", authenticate, authorization("admin"), UserController.getAll);
usersRouter.get("/:id_user", UserController.getById);

usersRouter.post("/", authenticate, authorization("admin"),UserController.create);
