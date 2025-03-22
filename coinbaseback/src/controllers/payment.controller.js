import { PaymentService } from "../services/payment.service.js";

export class PaymentController {
    static async getAll(req, res) {
        try {
            const payments = await PaymentService.getAll();
            res.json(payments);
        } catch (error) {
            res.status(500).json({
                error: "There was an error retrieving payments",
                details: error.message,
            });
        }
    }

    static async getById(req, res) {
        const { id_payment } = req.params;

        try {
            const payment = await PaymentService.getById(Number(id_payment));

            if (!payment) {
                return res.status(404).json({
                    error: "Payment not found",
                });
            }

            res.json(payment);
        } catch (error) {
            res.status(500).json({
                error: "There was an error retrieving the payment",
                details: error.message,
            });
        }
    }


    static async create(req, res) {
        const { method, status, receipt } = req.body;

        try {
            const newPayment = await PaymentService.create({
                method,
                status: status || 'pending',  // Por default pending 
                receipt: receipt || null,  
            });

            res.status(201).json({
                message: "Payment created successfully",
                payment: newPayment,
            });
        } catch (error) {
            res.status(500).json({
                error: "There was an error creating the payment",
                details: error.message,
            });
        }
    }


    static async updateStatus(req, res) {
        const { id_payment } = req.params;
        const { status } = req.body;

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                error: "Invalid status. Allowed values are: 'pending', 'approved', 'rejected'.",
            });
        }

        try {
            const updatedPayment = await PaymentService.updateStatus(Number(id_payment), status);
            res.json({
                message: "Payment status updated",
                payment: updatedPayment,
            });
        } catch (error) {
            res.status(500).json({
                error: "There was an error updating the payment status",
                details: error.message,
            });
        }
    }



    static async update(req, res) {
        const { id_payment } = req.params;
        const { method, status, receipt } = req.body;

        try {
            const updatedPayment = await PaymentService.update(id_payment, {
                method,
                status,
                receipt
            });

            res.json({
                message: "Payment updated successfully",
                payment: updatedPayment,
            });
        } catch (error) {
            res.status(500).json({
                error: "There was an error updating the payment",
                details: error.message,
            });
        }
    }

    
    static async delete(req, res) {
        const { id_payment } = req.params;

        try {
            const deletedPayment = await PaymentService.delete(Number(id_payment));
            res.json({
                message: "Payment deleted successfully",
                payment: deletedPayment,
            });
        } catch (error) {
            res.status(500).json({
                error: "There was an error deleting the payment",
                details: error.message,
            });
        }
    }
}
