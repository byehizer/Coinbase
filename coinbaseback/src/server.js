import express from "express";
import morgan from "morgan";
import cors from "cors";
import { productRouter } from "./routes/product.routes.js";  
import { orderRouter } from "./routes/order.routes.js";      
import { orderDetailRouter } from "./routes/order_detail.routes.js"; 
import { paymentRouter } from "./routes/payment.routes.js"; 
import { deliveryRouter } from "./routes/delivery.routes.js"; 
import { contactRouter } from "./routes/contact.routes.js";


const app = express();
const PORT = 5000;//La DB de google nos va a dar un puerto, asi que lo vamos a tener que cambiar mas adelante



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors({
    origin: "http://localhost:5173"
}));


app.get("/", (request, response) => {
    response.json({
        mensaje: "Hola Mundo",
        fecha: new Date().toLocaleDateString()
    });
});



// Rutas
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/order-details", orderDetailRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/deliveries", deliveryRouter);
app.use("/api/contact", contactRouter);
//Falta el de user pero no creo que lo usemos



app.listen(PORT, () => { console.log(`Server running on http://localhost:${PORT}`) })