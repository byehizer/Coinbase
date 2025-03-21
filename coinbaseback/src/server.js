import express from "express";

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
app.use("/api/canchas", canchasRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/reservas", reservasRouter);


app.listen(PORT, () => { console.log('Server running on http://localhost:${PORT}') })