import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export class StripeService {
  static async createCheckoutSession({items, orderId}) {
      if (!Array.isArray(items)) {
        console.log(items)
    throw new Error("Items debe ser un array");
  }
  
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ['card', 'link', 'us_bank_account'], // Stripe muestra todos los métodos disponibles
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100, // precio en centavos
        },
        quantity: item.quantity,
      })),
      metadata: {
        orderId: orderId.toString(), // para usar en el webhook
      },
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    return session.url;
  }
}
