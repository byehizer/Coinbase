import { Router } from "express";
import { UserService } from "../services/user.service.js";
import { UserController } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorization } from "../middlewares/authorization.js";

export const usersRouter = Router();

//Vamos a tener que agregarle los middlewares cuando el token al iniciar sesion funcione en el frontend, porque en el backend ya esta creado

usersRouter.get("/", /*authenticate, authorization, */ UserController.getAll);
usersRouter.get("/:id_user", UserController.getById);

usersRouter.post("/", /* authenticate, authorization, */ UserController.create);
