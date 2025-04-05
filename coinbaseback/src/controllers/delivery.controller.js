import { DeliveryService } from "../services/delivery.service.js";

export class DeliveryController {
    static async getAll(req, res) {
        try {
            const deliveries = await DeliveryService.getAll();
            res.json(deliveries);
        } catch (error) {
            res.status(500).json({
                error: "There was an error getting the deliveries",
                details: error.message,
            });
        }
    }

    static async getById(req, res) {
        const { id_delivery } = req.params;

        try {
            const delivery = await DeliveryService.getById(Number(id_delivery));

            if (!delivery) {
                return res.status(404).json({
                    error: "Delivery not found",
                });
            }

            res.json(delivery);
        } catch (error) {
            res.status(500).json({
                error: "There was an error getting the delivery",
                details: error.message,
            });
        }
    }

    static async create(req, res) {
        const { address, city, country, status } = req.body;

        const statusValue = (status || 'pending').toLowerCase(); // Pendiente por default

        try {
            const newDelivery = await DeliveryService.create({
                address,
                city,
                country,
                status: statusValue, 
            });

            res.status(201).json({
                message: "Delivery created successfully",
                delivery: newDelivery,
            });
        } catch (error) {
            res.status(500).json({
                error: "There was an error creating the delivery",
                details: error.message,
            });
        }
    }


    
    static async updateStatus(req, res) {
        const { id_delivery } = req.params;
        const { status } = req.body;

        if (!['pending', 'in transit', 'delivered'].includes(status)) {
            return res.status(400).json({
                error: "Invalid status. The valid statuses are: pending, in transit, delivered.",
            });
        }

        try {
            const updatedDelivery = await DeliveryService.updateStatus(Number(id_delivery), status);
            res.json({
                message: "Delivery status updated",
                delivery: updatedDelivery,
            });
        } catch (error) {
            res.status(500).json({
                error: "There was an error updating the delivery status",
                details: error.message,
            });
        }
    }




    static async update(req, res) {
        const { id_delivery } = req.params;
        const { address, city, country, status } = req.body;

        if (!address || !city || !country) {
            return res.status(400).json({
                error: "Missing required fields: address, city, and country are required.",
            });
        }

        const updatedData = {
            address,
            city,
            country,
            status: status || 'pending',
        };

        try {
            const updatedDelivery = await DeliveryService.update(Number(id_delivery), updatedData);
            
            if (!updatedDelivery) {
                return res.status(404).json({
                    error: "Delivery not found",
                });
            }
            res.json({
                message: "Delivery updated successfully",
                delivery: updatedDelivery,
            });
            
        } catch (error) {
            res.status(500).json({
                message: `Error updating delivery: ${error.message}`,
            });
        }
    }




    static async delete(req, res) {
        const { id_delivery } = req.params;

        try {
            const deletedDelivery = await DeliveryService.delete(Number(id_delivery));

            if (!deletedDelivery) {
                return res.status(404).json({ error: "Delivery not found" });
            }

            res.json({
                message: "Delivery deleted successfully",
            });
        } catch (error) {
            res.status(500).json({
                error: "There was an error deleting the delivery",
                details: error.message,
            });
        }
    }
}
