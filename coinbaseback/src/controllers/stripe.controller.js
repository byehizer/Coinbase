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

    try {
      switch (event.type) {
        case "checkout.session.completed":
          const result = await WebhookService.handleCheckoutCompleted(event);

          console.log(
            `✅ Orden ${result.orderId} pagada con ${result.paymentMethodEnum}`
          );
          break;

        case "checkout.session.expired":
          await WebhookService.handleCheckoutSessionExpired(event);
          console.log("⚠️ Sesión de checkout expirada.");
          break;

        case "payment_intent.payment_failed":
          await WebhookService.handlePaymentIntentFailed(event);
          console.log("❌ Payment intent fallido.");
          break;

        case "charge.refunded":
          await WebhookService.handleChargeRefunded(event);
          break;

        case "payment_intent.succeeded":
          const paymentIntent = event.data.object;
          console.log("💰 Pago exitoso:", paymentIntent.id);
          break;
        default:
          console.log(`ℹ️ Evento no manejado: ${event.type}`);
      }

      return res.status(200).json({ received: true });
    } catch (error) {
      console.error("❌ Webhook error:", error.message);
      return res.status(500).json({ error: "Error interno" });
    }
  }

  static async createCheckoutSession(req, res) {
    try {
      const url = await CheckoutService.startSession(req.body);
      return res.status(200).json({ url });
    } catch (error) {
      console.error("❌ StripeController Error:", error.message);
      return res
        .status(500)
        .json({ error: "Error al crear la sesión de Stripe" });
    }
  }
}
