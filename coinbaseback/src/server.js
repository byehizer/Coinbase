import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import bodyParser from "body-parser";
import { productRouter } from "./routes/product.routes.js";
import { orderRouter } from "./routes/order.routes.js";
import { orderDetailRouter } from "./routes/order_detail.routes.js";
import { paymentRouter } from "./routes/payment.routes.js";
import { deliveryRouter } from "./routes/delivery.routes.js";
import { messageRouter } from "./routes/message.routes.js";
import { usersRouter } from "./routes/user.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { stripeRouter } from "./routes/stripe.routes.js";
import { StripeController } from "./controllers/stripe.controller.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../docs/swagger.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: envFile });

const app = express();
const PORT = 5000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Seguridad: Helmet y Rate Limiting
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP cada 15 minutos
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Demasiadas solicitudes. Intenta nuevamente más tarde.",
  },
});
app.use(limiter);

// Webhook Stripe (antes de express.json)
app.post(
  "/api/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  StripeController.handleWebhook
);

// Middlewares generales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

// Carpeta pública para imágenes (local)
//app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Documentación Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta raíz
app.get("/", (req, res) => {
  res.json({
    mensaje: "Hola",
    fecha: new Date().toLocaleDateString(),
  });
});

// Rutas API
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/order-details", orderDetailRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/deliveries", deliveryRouter);
app.use("/api/messages", messageRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/stripe", stripeRouter);


process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

// Inicio servidor
if (process.env.NODE_ENV !== "test") {
  const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Puerto ${PORT} ya está en uso.`);
      process.exit(1);
    }
  });
}

export default app;
