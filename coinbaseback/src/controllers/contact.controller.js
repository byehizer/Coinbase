import nodemailer from "nodemailer";

export const contactController = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Configura tu transporte (esto es un ejemplo usando Gmail)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // tu correo
                pass: process.env.EMAIL_PASS, // contraseña o app password
            },
        });

        const mailOptions = {
            from: `"Your App Name" <${process.env.EMAIL_USER}>`, // El email de la aplicación
            to: process.env.EMAIL_USER, // Tu email donde recibirás el mensaje
            subject: `New Contact Message from ${name}`,
            text: `From: ${name} (${email})\n\n${message}`, // Incluye el email del usuario en el cuerpo
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send email" });
    }
};
