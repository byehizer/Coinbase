import { StripeService } from "../services/stripe.service.js";
import { OrderService } from "../services/order.service.js";
import { PaymentService } from "../services/payment.service.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export class StripeController {
 static async handleWebhook(req, res) {
  console.log("💥 Webhook recibido:", req.headers["stripe-signature"]);
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // IMPORTANTE: para el webhook el body debe ser raw, no parseado JSON
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = parseInt(session.metadata.orderId);

    try {
      // Obtiene el PaymentIntent completo con charges expandido
      const paymentIntent = await stripe.paymentIntents.retrieve(
        session.payment_intent,
        {
          expand: ["charges"],
        }
      );

      console.log("✅ PaymentIntent completo:", JSON.stringify(paymentIntent, null, 2));

      let paymentMethodEnum = "Stripe"; // default
      const paymentMethodType = paymentIntent.payment_method_types[0];

      // Intentar obtener el charge desde charges o latest_charge
      let charge = paymentIntent.charges?.data?.[0];

      if (!charge && paymentIntent.latest_charge) {
        try {
          charge = await stripe.charges.retrieve(paymentIntent.latest_charge);
        } catch (err) {
          console.warn("⚠️ No se pudo obtener latest_charge:", err.message);
        }
      }

      if (!charge) {
        console.warn("⚠️ No se encontraron cargos en el PaymentIntent. Usando 'Stripe' por defecto.");
      } else {
        const pmDetails = charge.payment_method_details;
        const funding = pmDetails?.card?.funding;

        if (paymentMethodType === "card") {
          if (funding === "credit") {
            paymentMethodEnum = "Credit_Card";
          } else if (funding === "debit") {
            paymentMethodEnum = "Debit_Card";
          } else {
            paymentMethodEnum = "Credit_Card"; // fallback
          }
        } else if (paymentMethodType === "apple_pay") {
          paymentMethodEnum = "Apple_Pay";
        } else if (paymentMethodType === "google_pay") {
          paymentMethodEnum = "Google_Pay";
        } else if (paymentMethodType === "us_bank_account") {
          paymentMethodEnum = "Cripto";
        } else {
          paymentMethodEnum = "Zelle"; // fallback para métodos desconocidos
        }
      }

      // Actualizar el pago con método y estado
      await PaymentService.update(orderId, {
        status: "approved",
        method: paymentMethodEnum,
      });

      // Marcar orden como pagada
      await OrderService.updateStatus(orderId, "paid");

      console.log(`✅ Orden ${orderId} marcada como pagada con método ${paymentMethodEnum}`);
    } catch (error) {
      console.error("❌ Error al actualizar orden/pago:", error.message);
      return res.status(500).json({ error: "Error interno" });
    }
  }

  // Confirmación a Stripe
  res.status(200).json({ received: true });
}


  static async createCheckoutSession(req, res) {
    try {
      console.log("req.body:", req.body);
      const {
        client_name,
        client_email,
        address,
        city,
        country,
        items,
        total,
      } = req.body;

      // Validar datos mínimos
      if (
        !client_name ||
        !client_email ||
        !address ||
        !city ||
        !country ||
        !Array.isArray(items) ||
        items.length === 0
      ) {
        return res.status(400).json({ error: "Datos incompletos o inválidos" });
      }

      try {
        // 1. Crear la orden en estado pendiente
        const order = await OrderService.create({
          client_name,
          client_email,
          address,
          city,
          country,
          total,
          payment_method: "Stripe",
          items,
        });

        // 2. Crear la sesión de Stripe con orderId en metadata
        const sessionUrl = await StripeService.createCheckoutSession({
          items,
          client_email,
          orderId: order.id,
        });

        // 3. Devolver URL
        return res.status(200).json({ url: sessionUrl });
      } catch (error) {
        console.error("Error:", error.message);

        // Si se creó una orden, la eliminás
        if (order?.id) {
          await OrderService.delete(order.id);
        }

        return res.status(500).json({ error: "Error al procesar el pago" });
      }
    } catch (error) {
      console.error("StripeController Error:", error.message);
      return res
        .status(500)
        .json({ error: "Error al crear la sesión de Stripe" });
    }
  }
}
