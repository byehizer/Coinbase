// docs/swagger.js

import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Coinbase API",
      version: "1.0.0",
      description: "Documentación oficial de la API de Coinbase",
    },
    servers: [
      {
        url: "http://localhost:5000/api", // cambia si tenés otra baseURL
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./docs/components/*.js"], // rutas a los archivos donde vas a documentar los endpoints
};

export const swaggerSpec = swaggerJSDoc(options);
