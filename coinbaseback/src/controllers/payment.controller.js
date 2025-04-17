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
        const { method, status } = req.body;
        const statusValue = (status || 'pending').toLowerCase();

        let receipt = null;
        if (req.file) {
            receipt = `/uploads/receipts/${req.file.filename}`;
        }

        try {
            const newPayment = await PaymentService.create({
                method,
                status: statusValue,
                receipt,
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
        const { method, status } = req.body;

        let dataToUpdate = {
            method,
            status,
        };

        if (req.file) {
            dataToUpdate.receipt = `/uploads/receipts/${req.file.filename}`;
        }

        try {
            const updatedPayment = await PaymentService.update(id_payment, dataToUpdate);


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
