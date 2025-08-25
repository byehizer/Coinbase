import { OrderService } from "../services/order.service.js";
import { updateOrderSchema } from "../schemas/order.schema.js";

export async function validateOrderUpdateForm(req, res, next) {
  const id_order = Number(req.params.id_order);
  if (isNaN(id_order)) {
    return res.status(400).json({ error: "Invalid order ID" });
  }

  try {
    // Validación de estructura con Zod
    updateOrderSchema.parse(req.body);
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.errors?.[0]?.message || "Invalid input" });
  }

  try {
    const order = await OrderService.getById(id_order);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (!order.payment || !order.delivery) {
      return res.status(400).json({
        error:
          "Order must have both payment and delivery assigned to be updated.",
      });
    }

    // Reglas de negocio
    if (
      order.status === "delivered" ||
      order.status === "cancelled" ||
      order.payment.status === "refunded"
    ) {
      return res.status(400).json({
        error: `Order cannot be updated. Current status: ${order.status}, Payment status: ${order.payment.status}`,
      });
    }

    if (
      order.status === "pending" &&
      req.body.status === "pending" &&
      req.body.trackingStatus &&
      req.body.trackingStatus !== order.delivery?.status
    ) {
      return res.status(400).json({
        error: "Cannot update tracking status while order is still pending",
      });
    }

    const paymentMethod = order.payment?.method;
    if (
      order.status === "paid" &&
      paymentMethod !== "Venmo" &&
      paymentMethod !== "Zelle" &&
      req.body.status &&
      (req.body.status === "pending" || req.body.status === "cancelled")
    ) {
      return res.status(400).json({
        error: `Order status cannot be changed to '${req.body.status}' for payment method '${paymentMethod}' after payment`,
      });
    }

    req.id_order = id_order;
    req.order = order;
    next();
  } catch (error) {
    console.error("Validation error:", error);
    return res
      .status(500)
      .json({ error: "Error validating order", details: error.message });
  }
}
