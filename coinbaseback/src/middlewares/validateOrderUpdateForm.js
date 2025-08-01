import { OrderService } from "../services/order.service.js";

export async function validateOrderUpdateForm(req, res, next) {
  const id_order = Number(req.params.id_order);
  if (isNaN(id_order)) {
    return res.status(400).json({ error: "Invalid order ID" });
  }

  const {
    clientName,
    clientEmail,
    status,
    trackingStatus,
    deliveryAddress,
    deliveryCity,
    deliveryCountry,
  } = req.body;

  // Validar campos obligatorios
  if (!clientName || !clientName.trim()) {
    return res.status(400).json({ error: "Client name is required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!clientEmail || !emailRegex.test(clientEmail)) {
    return res.status(400).json({ error: "Valid client email is required" });
  }

  const validStatuses = [
    "pending",
    "cancelled",
    "delivered",
    "shipped",
    "paid",
  ];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  const validTracking = ["pending", "in_transit", "delivered"];
  if (trackingStatus && !validTracking.includes(trackingStatus)) {
    return res.status(400).json({ error: "Invalid tracking status" });
  }

  try {
    // Obtener la orden original
    const order = await OrderService.getById(id_order);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (
      order.status === "delivered" ||
      order.status === "cancelled" ||
      order.payment.status === "refunded"
    ) {
      return res.status(400).json({
        error: `Order cannot be updated. Current status: ${order.status}, Payment status: ${order.payment.status}`,
      });
    }

    // No permitir cambiar tracking si la orden está "pending"
    if (
      order.status === "pending" &&
      trackingStatus &&
      trackingStatus !== order.delivery?.status
    ) {
      return res.status(400).json({
        error: "Cannot update tracking status while order is still pending",
      });
    }

    const paymentMethod = order.payment?.method;
    if (
      order.status === "paid" &&
      paymentMethod !== "venmo" &&
      paymentMethod !== "zelle" &&
      status &&
      (status === "pending" || status === "cancelled")
    ) {
      return res.status(400).json({
        error: `Order status cannot be changed to '${status}' for payment method '${paymentMethod}' after payment`,
      });
    }

    req.id_order = id_order;
    req.order = order; // en caso de que necesites usarla después en el controller
    next();
  } catch (error) {
    console.error("Validation error:", error);
    return res
      .status(500)
      .json({ error: "Error validating order", details: error.message });
  }
}
