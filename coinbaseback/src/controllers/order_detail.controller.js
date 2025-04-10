import { OrderDetailService } from "../services/order_detail.service.js";

export class OrderDetailController {
    static async getAll(req, res) {
        try {
            const orderDetails = await OrderDetailService.getAll();
            res.json(orderDetails);
        } catch (error) {
            res.status(500).json({
                error: "Error fetching order details",
                details: error.message,
            });
        }
    }

    static async getById(req, res) {
        const { id_order_detail } = req.params;
        try {
            const orderDetail = await OrderDetailService.getById(Number(id_order_detail));
            if (!orderDetail) {
                return res.status(404).json({
                    error: "Order detail not found",
                });
            }
            res.json(orderDetail);
        } catch (error) {
            res.status(500).json({
                error: "Error fetching order detail",
                details: error.message,
            });
        }
    }

    static async create(req, res) {
        const { id_order, id_product, quantity, price_unit } = req.body;
        try {
            const newOrderDetail = await OrderDetailService.create({
                id_order,
                id_product,
                quantity,
                price_unit,
            });
            res.status(201).json({
                message: "Order detail created successfully",
                orderDetail: newOrderDetail,
            });
        } catch (error) {
            res.status(500).json({
                error: "Error creating order detail",
                details: error.message,
            });
        }
    }

    static async update(req, res) {
        const { id_order_detail } = req.params;
        const { quantity, price_unit } = req.body;
        try {
            const updatedOrderDetail = await OrderDetailService.update(Number(id_order_detail), {
                quantity,
                price_unit,
            });
            res.json({
                message: "Order detail updated successfully",
                orderDetail: updatedOrderDetail,
            });
        } catch (error) {
            res.status(500).json({
                error: "Error updating order detail",
                details: error.message,
            });
        }
    }

    static async delete(req, res) {
        const { id_order_detail } = req.params;
        try {
            const deletedOrderDetail = await OrderDetailService.delete(Number(id_order_detail));
            res.json({
                message: "Order detail deleted successfully",
                orderDetail: deletedOrderDetail,
            });
        } catch (error) {
            res.status(500).json({
                error: "Error deleting order detail",
                details: error.message,
            });
        }
    }
}
