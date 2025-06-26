import { StripeService } from "../services/stripe.service.js";
import { OrderService } from "../services/order.service.js";

export class StripeController {
  static async createCheckoutSession(req, res) {
    try {
        console.log("req.body:", req.body)
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

      // 1. Crear la orden en estado pendiente
      const order = await OrderService.create({
        client_name,
        client_email,
        address,
        city,
        country,
        total,
        payment_method: "PayPal",
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
      console.error("StripeController Error:", error.message);
      return res.status(500).json({ error: "Error al crear la sesión de Stripe" });
    }
  }
}