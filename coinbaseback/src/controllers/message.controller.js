import { MessageService } from "../services/message.service.js";

export class MessageController {

    static async getAll(req, res) {
        try {
            const messages = await MessageService.getAll();
            res.json(messages);
        } catch (error) {
            res.status(500).json({ error: "Error fetching messages", details: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const message = await MessageService.getById(req.params.id);
            if (!message) return res.status(404).json({ error: "Message not found" });
            res.json(message);
        } catch (error) {
            res.status(500).json({ error: "Error fetching message", details: error.message });
        }
    }


    static async create(req, res) {
        try {
            const { name, email, message } = req.body;

            if (!name || !email || !message) {
                return res.status(400).json({ error: "All fields are required." });
            }

            const newMessage = await MessageService.create({ name, email, message });

            res.status(201).json({
                message: "Message saved successfully",
                data: newMessage,
            });
        } catch (error) {
            console.error("Error saving message:", error);
            res.status(500).json({
                error: "Error saving message",
                details: error.message,
            });
        }
    }


    static async delete(req, res) {
        try {
            await MessageService.delete(req.params.id);
            res.json({ message: "Message deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: "Error deleting message", details: error.message });
        }
    }
}
