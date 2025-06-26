import { Router } from "express";
import { StripeController } from "../controllers/stripe.controller.js";

export const stripeRouter = Router();

// POST /api/stripe/checkout
stripeRouter.post("/checkout", StripeController.createCheckoutSession);