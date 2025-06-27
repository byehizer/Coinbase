import { OrderService } from "./order.service.js";
import { StripeService } from "./stripe.service.js";

export class CheckoutService {
  static async startSession(data) {
    const {
      client_name,
      client_email,
      address,
      city,
      country,
      items,
      total,
    } = data;

    if (!client_name || !client_email || !address || !city || !country || !Array.isArray(items) || items.length === 0) {
      throw new Error("Datos incompletos o inválidos");
    }

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

    try {
      const sessionUrl = await StripeService.createCheckoutSession({
        items,
        client_email,
        orderId: order.id,
      });

      return sessionUrl;
    } catch (error) {
      await OrderService.delete(order.id); 
      throw error;
    }
  }
}