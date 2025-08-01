import { DeliveryService } from "../services/delivery.service.js";
import { OrderService } from "../services/order.service.js";
import { PaymentService } from "../services/payment.service.js";
import {
  sendManualPaymentInstructions,
  sendRejectionEmail,
  sendStripeConfirmationEmail,
} from "../utils/email.utils.js";
import dotenv from "dotenv";
import Stripe from "stripe";
import { ProductService } from "../services/product.service.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export class OrderController {
  static async getAll(req, res) {
    try {
      const orders = await OrderService.getAll();
      res.json(orders);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error fetching orders", details: error.message });
    }
  }
  static async uploadReceipt(req, res) {
    try {
      const orderId = Number(req.params.id);
      const file = req.file;
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Obtener orden y verificar existencia
      const order = await OrderService.getById(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Verificar que el email coincida
      if (order.email !== email) {
        return res
          .status(403)
          .json({ error: "Unauthorized: Email does not match order" });
      }

      // Verificar estado del pago
      const payment = await PaymentService.getByOrderId(orderId);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      if (["paid", "cancel"].includes(payment.status)) {
        return res.status(400).json({
          error: `Cannot upload receipt. Current payment status: ${payment.status}`,
        });
      }

      if (order.payment?.receipt) {
        const oldPath = path.join(
          "uploads",
          path.basename(order.payment.receipt)
        );
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // Subir comprobante
      const fileUrl = `/uploads/${file.filename}`;
      const updatedPayment = await PaymentService.updateReceipt(
        orderId,
        fileUrl
      );

      res.json({
        receipt: fileUrl,
        message: "Receipt uploaded successfully",
        payment: updatedPayment,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Failed to upload receipt", details: error.message });
    }
  }

  static async rejectOrder(req, res) {
    const { id } = req.params;

    try {
      const order = await OrderService.getById(Number(id));
      if (!order) return res.status(404).json({ error: "Order not found" });

      if (order.status !== "pending") {
        return res.status(400).json({ error: "Order is not in pending state" });
      }

      await OrderService.updateStatus(order.id, "cancelled");

      await PaymentService.update(Number(order.id), { status: "rejected" });

      await sendRejectionEmail({
        id: order.id,
        client_email: order.client_email,
        client_name: order.client_name,
      });

      res.json({ message: "Order rejected." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to reject order" });
    }
  }

  static async publicgetbyid(req, res) {
    const id = req.params.id;
    const { email } = req.body;

    const order = await OrderService.getById(Number(id));
    console.log(order);
    console.log(email);
    if (!order || order.client_email !== email) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const products = order.OrderDetail.map((item) => ({
      name: item.product_name,
      image: item.product_image_url,
      quantity: item.quantity,
      unitPrice: item.price_unit,
    }));

    const response = {
      id: order.id,
      clientName: order.client_name,
      clientEmail: order.client_email,
      orderDate: order.order_date,
      total: order.total,
      status: order.status,
      paymentMethod: order.payment?.method || null,
      trackingStatus: order.delivery?.status || null,
      address: order.delivery?.address || "",
      city: order.delivery?.city || "",
      country: order.delivery?.country || "",
      receipt: order.payment?.receipt || null,
      products,
    };

    res.json(response);
  }
  static async getById(req, res) {
    try {
      const order = await OrderService.getById(Number(req.params.id_order));
      if (!order) return res.status(404).json({ error: "Order not found" });

      const products = order.OrderDetail.map((item) => ({
        name: item.product_name,
        image: item.product_image_url,
        quantity: item.quantity,
        unitPrice: item.price_unit,
      }));

      const response = {
        id: order.id,
        clientName: order.client_name,
        clientEmail: order.client_email,
        orderDate: order.order_date,
        total: order.total,
        status: order.status,
        paymentMethod: order.payment?.method || null,
        trackingStatus: order.delivery?.status || null,
        address: order.delivery?.address || "",
        city: order.delivery?.city || "",
        country: order.delivery?.country || "",
        receipt: order.payment?.receipt || null,
        products,
      };

      res.json(response);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Error fetching order", details: error.message });
    }
  }

  static async approveOrder(req, res) {
    const { id } = req.params;

    try {
      const order = await OrderService.getById(Number(id));

      if (!order) return res.status(404).json({ error: "Order not found" });
      if (order.status !== "pending") {
        return res.status(400).json({ error: "Order is not pending" });
      }

      for (const item of order.OrderDetail) {
        const product = await ProductService.getById(item.id_product);
        if (!product || product.stock < item.quantity) {
          return res.status(400).json({
            error: `Not enough stock for product ${item.product_name}`,
          });
        }
      }

      await OrderService.updateStatus(order.id, "paid");

      for (const item of order.OrderDetail) {
        await ProductService.decreaseStock(item.id_product, item.quantity);
      }

      // Marcar pago como aprobado
      await PaymentService.update(order.id, { status: "approved" });

      // (Opcional) enviar email de confirmación al cliente
      await sendStripeConfirmationEmail({
        id: order.id,
        client_email: order.client_email,
        client_name: order.client_name,
      });

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error approving order" });
    }
  }

  static async create(req, res) {
    try {
      console.log(req.body);
      const newOrder = await OrderService.create(req.body);

      await sendManualPaymentInstructions({
        id: newOrder.id,
        client_email: newOrder.client_email,
        clientName: newOrder.client_name,
      });

      console.log(newOrder);
      res
        .status(201)
        .json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Error creating order", details: error.message });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { status } = req.body;
      const validStatuses = ["pending", "paid", "shipped", "delivered"];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const updatedOrder = await OrderService.updateStatus(
        Number(req.params.id_order),
        status
      );
      res.json({ message: "Order status updated", order: updatedOrder });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error updating order status", details: error.message });
    }
  }

  static async update(req, res) {
    try {
      const id_order = req.id_order; // viene del middleware
      const order = req.order; // también del middleware
      const {
        clientName,
        clientEmail,
        status,
        trackingStatus,
        deliveryAddress,
        deliveryCity,
        deliveryCountry,
      } = req.body;

      const updatedOrder = await OrderService.update(id_order, {
        client_name: clientName,
        client_email: clientEmail,
        status: status || order.status,
      });

      if (status === "pending" && order.payment?.status !== "pending") {
        await PaymentService.update(order.id, { status: "pending" });
      }
      if (order.id_delivery) {
        await DeliveryService.update(order.id_delivery, {
          address: deliveryAddress,
          city: deliveryCity,
          country: deliveryCountry,
          status: trackingStatus || order.delivery?.status,
        });
      }

      const prevStatus = order.status;
      const newStatus = status || prevStatus;
      const shouldRevertStock =
        ["paid", "shipped"].includes(prevStatus) &&
        ["cancelled", "pending"].includes(newStatus);
      console.log(shouldRevertStock);
      if (shouldRevertStock) {
        const orderItems = await OrderService.getOrderItems(id_order);
        for (const item of orderItems) {
          await ProductService.increaseStock(item.id_product, item.quantity);
        }
      }

      const fullOrder = await OrderService.getById(id_order);
      return res.json(fullOrder);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Error updating order",
        details: error.message,
      });
    }
  }

  static async delete(req, res) {
    try {
      const id_order = Number(req.params.id_order);
      const deleted = await OrderService.deleteCascade(id_order);

      res.json({
        message: "Order deleted successfully",
        order: deleted,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Error deleting order",
        details: error.message,
      });
    }
  }

  static async refund(req, res) {
    const { orderId } = req.params;

    try {
      const order = await OrderService.getById(Number(orderId));
      if (!order || !order.payment || !order.payment.chargeId) {
        return res
          .status(404)
          .json({ error: "No se encontró el pago válido para reembolso" });
      }

      if (order.payment.status === "refunded") {
        return res.status(400).json({ error: "La orden ya fue reembolsada" });
      }

      // Crear el reembolso (webhook hará el resto)
      const refund = await stripe.refunds.create({
        charge: order.payment.chargeId,
      });

      return res.status(200).json({ message: "Reembolso iniciado", refund });
    } catch (err) {
      console.error("❌ Error al iniciar reembolso:", err.message);
      return res.status(500).json({ error: "Error al procesar el reembolso" });
    }
  }
}
