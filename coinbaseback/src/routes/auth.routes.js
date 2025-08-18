import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

export const authRouter = Router();

authRouter.post("/login", AuthController.login);
/*authRouter.post("/profile", authenticate, AuthController.profile);*/
