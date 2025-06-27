import { WebhookService } from "../services/webhook.service.js";
import { CheckoutService } from "../services/checkout.service.js";
import dotenv from "dotenv";
import Stripe from "stripe";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export class StripeController {
  static async handleWebhook(req, res) {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      try {
        const result = await WebhookService.handleCheckoutCompleted(event);
        console.log(`✅ Orden ${result.orderId} pagada con ${result.paymentMethodEnum}`);
      } catch (error) {
        console.error("❌ Webhook error:", error.message);
        return res.status(500).json({ error: "Error interno" });
      }
    }

    res.status(200).json({ received: true });
  }

  static async createCheckoutSession(req, res) {
    try {
      const url = await CheckoutService.startSession(req.body);
      return res.status(200).json({ url });
    } catch (error) {
      console.error("❌ StripeController Error:", error.message);
      return res.status(500).json({ error: "Error al crear la sesión de Stripe" });
    }
  }
}
