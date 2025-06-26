import express from "express";
import morgan from "morgan";
import cors from "cors";
import { productRouter } from "./routes/product.routes.js";
import { orderRouter } from "./routes/order.routes.js";
import { orderDetailRouter } from "./routes/order_detail.routes.js";
import { paymentRouter } from "./routes/payment.routes.js";
import { deliveryRouter } from "./routes/delivery.routes.js";
import { contactRouter } from "./routes/contact.routes.js";
import { messageRouter } from "./routes/message.routes.js";
import { usersRouter } from "./routes/user.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { stripeRouter } from "./routes/stripe.routes.js";
dotenv.config();

const app = express();
const PORT = 5000; //La DB de google nos va a dar un puerto, asi que lo vamos a tener que cambiar mas adelante

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);


const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuración de carpeta pública
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (request, response) => {
  response.json({
    mensaje: "Hola Mundo",
    fecha: new Date().toLocaleDateString(),
  });
});

// Rutas
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/order-details", orderDetailRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/deliveries", deliveryRouter);
app.use("/api/contact", contactRouter);
app.use("/api/messages", messageRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/stripe", stripeRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
