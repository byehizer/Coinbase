# 🪙 Coinbase - Plataforma de Venta de Billetes Antiguos

Coinbase es una plataforma web desarrollada para la venta de billetes antiguos. Permite a los usuarios comprar sin necesidad de crear una cuenta, gestionar pedidos y pagos de forma sencilla, y cuenta con un panel de administración protegido. El sistema está completamente documentado, probado y listo para producción.

## 📑 Tabla de Contenido

* [🚀 Tecnologías Utilizadas](#-tecnolog%C3%ADas-utilizadas)
* [📦 Características Principales](#-caracter%C3%ADsticas-principales)
* [🛠️ Instalación y Configuración](#-instalaci%C3%B3n-y-configuraci%C3%B3n)
* [🐳 Docker (opcional)](#-docker-opcional)
* [🧱 Migraciones y Seeds](#-migraciones-y-seeds)
* [🌐 Frontend y Stripe](#-frontend-y-stripe)
* [📡 Webhooks y Ngrok](#-webhooks-y-ngrok)
* [📬 API Docs](#-api-docs)
* [🧠 Mejoras a Implementar](#-mejoras-a-implementar)
* [👤 Autor](#-autor)

## 🚀 Tecnologías Utilizadas

* **Frontend**: React.js, Tailwind CSS, Fetch API
* **Backend**: Node.js con Express, JWT (panel admin), Multer, SendGrid, Stripe, Swagger/OpenAPI
* **Base de Datos**: PostgreSQL, Prisma ORM
* **Arquitectura**: Clean Architecture, estructura modular (controllers, services, routes, middlewares)

## 📦 Características Principales

* 🛒 Carrito funcional sin necesidad de cuenta
* 💳 Pagos con Stripe (tarjetas, Apple Pay, Google Pay)
* 💸 Soporte para Zelle y Venmo (con comprobante)
* 🧾 Generación de órdenes con formulario del cliente
* 🔐 Panel admin seguro con JWT
* ✉️ Envío de emails con SendGrid
* 🖼️ Subida de imágenes al backend (`/uploads`)
* 📄 API documentada con Swagger
* 📱 Diseño responsive para móviles

## 🛠️ Instalación y Configuración

```bash
# Clonar el repositorio
https://github.com/byehizer/Coinbase.git

# Instalar dependencias backend
cd backend
npm install

# Instalar dependencias frontend
cd ../frontend
npm install

# Crear archivo .env con las variables necesarias

# Iniciar backend
cd backend
npm run dev

# Iniciar frontend
cd ../frontend
npm run dev
```

### Variables de entorno necesarias

```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/coinbase
STRIPE_SECRET_KEY=tu_clave_secreta_de_stripe
SENDGRID_API_KEY=tu_clave_de_sendgrid
SENDGRID_SENDER=ejemplo@ejemplo.com
JWT_SECRET=clave_para_jwt
FRONTEND_URL=http://localhost:3000
```

## 🐳 Docker (opcional)

```bash
docker-compose up -d
```

Para detener los servicios:

```bash
docker-compose down
```

## 🧱 Migraciones y Seeds

```bash
npx prisma migrate dev
npx prisma db seed
```

## 🌐 Frontend y Stripe

Asegurate de que el valor de `FRONTEND_URL` apunte correctamente al dominio donde corre tu frontend.

```bash
npm run dev
```

## 📡 Webhooks y Ngrok

Para pruebas locales con Stripe:

```bash
ngrok http 5000
```

Configurar webhooks en Stripe con:

```
https://tu-ngrok-id.ngrok.io/api/stripe/webhook
```

## 📬 API Docs

Disponible en desarrollo en:

```
http://localhost:5000/api-docs
```

## 🧠 Mejoras a Implementar

* [ ] Validaciones centralizadas con Zod o Joi
* [ ] Manejo de errores robusto con `boom`
* [ ] Subida directa de imágenes a Google Cloud Storage
* [ ] Middleware de seguridad (`helmet`, `express-rate-limit`)
* [ ] Tests unitarios y de integración (`Vitest`, `Jest`, `Supertest`)
* [ ] CI/CD con GitHub Actions
* [ ] Despliegue backend (Railway/Render)
* [ ] Logs estructurados y monitoreo con Sentry
* [ ] Uso de DTOs y capa de validación más formal
* [ ] Crear entorno staging
* [ ] Aislar lógica de pago como microservicio (si escala)


## 👤 Autor

* **Ehizer Jesus Valero Bastidas**
* GitHub: [byehizer](https://github.com/byehizer)
* Proyecto personal full-stack

