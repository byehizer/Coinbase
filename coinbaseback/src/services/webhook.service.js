import Stripe from "stripe";
import dotenv from "dotenv";
import { OrderService } from "./order.service.js";
import { PaymentService } from "./payment.service.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export class WebhookService {
  static async handleCheckoutCompleted(event) {
    const session = event.data.object;
    const orderId = parseInt(session.metadata.orderId);

    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent,
      {
        expand: ["charges"],
      }
    );

    const charge = await this.getCharge(paymentIntent);
    const paymentMethodEnum = this.resolvePaymentMethod(paymentIntent, charge);

    await PaymentService.update(orderId, {
      status: "approved",
      method: paymentMethodEnum,
      paymentIntentId: paymentIntent.id,
      chargeId: charge?.id ?? null,
    });

    await OrderService.updateStatus(orderId, "paid");

    return { orderId, paymentMethodEnum };
  }
  static async handleCheckoutSessionExpired(event) {
    const session = event.data.object;
    const orderId = parseInt(session.metadata.orderId);
    await OrderService.updateStatus(orderId, "cancelled");
  }

  static async handlePaymentIntentFailed(event) {
    const paymentIntent = event.data.object;
    const orderId = parseInt(paymentIntent.metadata?.orderId);
    if (orderId) {
      await PaymentService.update(orderId, { status: "rejected" });
      await OrderService.updateStatus(orderId, "cancelled");
    }
  }
  static async getCharge(paymentIntent) {
    let charge = paymentIntent.charges?.data?.[0];

    if (!charge && paymentIntent.latest_charge) {
      try {
        charge = await stripe.charges.retrieve(paymentIntent.latest_charge);
      } catch (err) {
        console.warn("⚠️ No se pudo obtener latest_charge:", err.message);
      }
    }

    return charge;
  }

  static resolvePaymentMethod(paymentIntent, charge) {
    const type = paymentIntent.payment_method_types?.[0];

    console.log("📦 Payment Method Details:", {
      type,
      funding: charge?.payment_method_details?.card?.funding,
    });

    if (type === "card") {
      const funding = charge?.payment_method_details?.card?.funding;

      if (funding === "debit") return "Debit_Card";
      if (funding === "credit") return "Credit_Card";

      // Si no se pudo determinar, asumimos que es tarjeta
      return "Credit_Card";
    }

    if (type === "apple_pay") return "Apple_Pay";
    if (type === "google_pay") return "Google_Pay";
    if (type === "us_bank_account") return "Cripto";

    return "Zelle"; // fallback final solo si no reconocimos nada
  }

  static async handleChargeRefunded(event) {
  const charge = event.data.object;
  const paymentIntentId = charge.payment_intent;

  const payment = await PaymentService.findByIntentId(paymentIntentId);
  if (!payment) {
    console.warn("⚠️ No se encontró el pago con paymentIntent:", paymentIntentId);
    return;
  }

  const orderId = payment.orderId;

 
  await PaymentService.update(orderId, { status: "refunded" });
  await OrderService.updateStatus(orderId, "cancelled");

  console.log(`🔁 Orden ${orderId} reembolsada vía webhook.`);
}

}
