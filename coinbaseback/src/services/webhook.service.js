import Stripe from "stripe";
import dotenv from "dotenv";
import { OrderService } from "./order.service.js";
import { PaymentService } from "./payment.service.js";
import { sendStripeConfirmationEmail } from "../utils/email.utils.js";
import { ProductService } from "./product.service.js";

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

    console.log(`Order a cambiar metodo de pago: ${orderId}`);

    // 1. Actualizar el estado del pago
    await PaymentService.updateByOrderId(orderId, {
      status: "approved",
      method: paymentMethodEnum,
      paymentIntentId: paymentIntent.id,
      chargeId: charge?.id ?? null,
    });

    // 2. Cambiar estado de la orden
    await OrderService.updateStatus(orderId, "paid");

    // 3. Obtener la orden completa para enviar email
    const order = await OrderService.getById(orderId);

    if (!order) {
      console.warn(
        `⚠️ No se encontró la orden con ID ${orderId} para enviar el email`
      );
      return;
    }

    for (const detail of order.OrderDetail) {
      await ProductService.decreaseStock(detail.id_product, detail.quantity);
    }

    await sendStripeConfirmationEmail({
      id: order.id,
      client_email: order.client_email,
      client_name: order.client_name,
    });

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

  // 1. Traer el pago por intentID
  const payment = await PaymentService.findByIntentId(paymentIntentId);
  if (!payment) {
    console.warn("⚠️ No se encontró el pago con paymentIntentId:", paymentIntentId);
    return;
  }

  // 2. Traer la orden relacionada
  const order = await OrderService.findByPaymentId(payment.id);
  if (!order) {
    console.warn("⚠️ No se encontró la orden relacionada al payment:", payment.id);
    return;
  }

  // 3. Actualizar estados
  await PaymentService.updateStatus(payment.id, "refunded");
  await OrderService.updateStatus(order.id, "cancelled");

  // 4. Devolver stock
  for (const item of order.OrderDetail) {
    await ProductService.increaseStock(item.id_product, item.quantity);
  }

  console.log(`🔁 Orden ${order.id} reembolsada vía webhook.`);
}

}
