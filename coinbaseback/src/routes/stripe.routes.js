import { Router } from "express";
import { StripeController } from "../controllers/stripe.controller.js";
import bodyParser from "body-parser";

export const stripeRouter = Router();

// POST /api/stripe/checkout
stripeRouter.post("/checkout", StripeController.createCheckoutSession);

