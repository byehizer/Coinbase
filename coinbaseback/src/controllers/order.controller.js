import { OrderService } from "../services/order.service.js";
import { PaymentService } from "../services/payment.service.js";

export class OrderController {
    static async getAll(req, res) {
        try {
            const orders = await OrderService.getAll();
            res.json(orders);
        } catch (error) {
            res.status(500).json({ error: "Error fetching orders", details: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const order = await OrderService.getById(Number(req.params.id_order));
            if (!order) return res.status(404).json({ error: "Order not found" });
            res.json(order);
        } catch (error) {
            res.status(500).json({ error: "Error fetching order", details: error.message });
        }
    }

    static async create(req, res) {
        try {
            const newOrder = await OrderService.create(req.body);
            console.log(newOrder);
            res.status(201).json({ message: "Order created successfully", order: newOrder });
        } catch (error) {
            res.status(500).json({ error: "Error creating order", details: error.message });
        }
    }

    static async updateStatus(req, res) {
        try {
            const { status } = req.body;
            const validStatuses = ["pending", "paid", "shipped", "delivered"];

            if (!validStatuses.includes(status)) {
                return res.status(400).json({ error: "Invalid status" });
            }

            const updatedOrder = await OrderService.updateStatus(Number(req.params.id_order), status);
            res.json({ message: "Order status updated", order: updatedOrder });
        } catch (error) {
            res.status(500).json({ error: "Error updating order status", details: error.message });
        }
    }



    static async update(req, res) {
        try {
            const id_order = Number(req.params.id_order);
            const {client_name,client_email,total,status,id_payment,id_delivery,payment_method} = req.body;

            const updatedOrder = await OrderService.update(id_order, {
                client_name,
                client_email,
                total,
                status,
                id_payment,
                id_delivery,
            });

            if (id_payment && payment_method) {
                await PaymentService.update(id_payment, {method: payment_method,});
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
            res.status(500).json({ error: "Error deleting order", details: error.message });
        }
    }
}
