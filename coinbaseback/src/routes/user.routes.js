import { Router } from "express";
import { UserService } from "../services/user.service.js";
import { UsuarioController } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorization } from "../middlewares/authorization.js";

export const usersRouter = Router();

//Chequear que las rutas coincidan con las rutas que pusimos en el front y agregar el middleware que necesite. (Por eso comento las rutas)
/*
usersRouter.get("/", authenticate, authorization, UsuarioController.getAll)

usersRouter.post("/", authenticate, authorization, UsuarioController.create)
*/