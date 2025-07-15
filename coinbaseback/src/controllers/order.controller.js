import { OrderService } from "../services/order.service.js";
import { PaymentService } from "../services/payment.service.js";
import { sendManualPaymentInstructions } from "../utils/email.utils.js";

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
  static async rejectOrder(req, res) {
    const { id } = req.params;

    try {
      const order = await OrderService.getById(Number(id));
      if (!order) return res.status(404).json({ error: "Order not found" });

      if (order.status !== "pending") {
        return res.status(400).json({ error: "Order is not in pending state" });
      }

      
      await OrderService.updateStatus(order.id, "cancelled");


      await PaymentService.update(order.id, { status: "rejected" });

     
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

  static async getById(req, res) {
    try {
      const order = await OrderService.getById(Number(req.params.id_order));
      if (!order) return res.status(404).json({ error: "Order not found" });

      const products = order.OrderDetail.map((item) => ({
        name: item.product.name,
        image: item.product.image_url,
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

      // Actualizar estado a "paid"
      await OrderService.updateStatus(order.id, "paid");

      // Restar stock
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
      const id_order = Number(req.params.id_order);
      const {
        client_name,
        client_email,
        total,
        status,
        id_payment,
        id_delivery,
        payment_method,
      } = req.body;

      const updatedOrder = await OrderService.update(id_order, {
        client_name,
        client_email,
        total,
        status,
        id_payment,
        id_delivery,
      });

      if (id_payment && payment_method) {
        await PaymentService.update(id_payment, { method: payment_method });
      }

      res.json({
        message: "Order updated successfully",
        order: updatedOrder,
      });
    } catch (error) {
      res.status(500).json({
        error: "Error updating order",
        details: error.message,
      });
    }
  }

  static async delete(req, res) {
    try {
      const result = await OrderService.delete(Number(req.params.id_order));
      res.json({ message: "Order deleted successfully", order: result });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error deleting order", details: error.message });
    }
  }
}
