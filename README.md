# 🪙 Coinbase - Plataforma de Venta de Billetes Antiguos

Coinbase es una aplicación web full-stack para la venta de billetes antiguos.  
Permite a los usuarios navegar por un catálogo, añadir productos a un carrito sin necesidad de crear cuenta, pagar con Stripe, Zelle o Venmo, y recibir confirmación por email.  
Cuenta además con un **panel de administración protegido** donde se gestionan productos, pedidos e imágenes.  

📌 Proyecto desarrollado con arquitectura modular, validaciones robustas y despliegue en la nube.  

## 📑 Tabla de Contenido

* [🌍 Demo Online](#-demo-online)  
* [🚀 Tecnologías Utilizadas](#-tecnologías-utilizadas)  
* [📦 Características Principales](#-características-principales)  
* [📸 Capturas de Pantalla](#-capturas-de-pantalla)  
* [🛠️ Instalación y Configuración](#-instalación-y-configuración)  
* [🐳 Docker (opcional)](#-docker-opcional)  
* [🧱 Migraciones y Seeds](#-migraciones-y-seeds)  
* [📡 Webhooks y Ngrok](#-webhooks-y-ngrok)  
* [🧩 Diagrama de Arquitectura](#-diagrama-de-arquitectura)  
* [📬 API Docs](#-api-docs)  
* [🧠 Mejoras Futuras](#-mejoras-futuras)  
* [👤 Autor](#-autor)  

---

## 🌍 Demo Online  
- **Frontend**: [Coinbase en Vercel](https://coinbase-sandy-xi.vercel.app)  
- **Backend / API Docs**: [Coinbase en Railway](https://practical-light-production.up.railway.app)  

🔑 **Panel Admin**  
- Usuario: `admin@admin.com`  
- Contraseña: `admin123`  

---

## 🚀 Tecnologías Utilizadas

* **Frontend**: React.js, Tailwind CSS, Fetch API  
* **Backend**: Node.js con Express, JWT (panel admin), Zod, Multer, SendGrid, Stripe, Swagger/OpenAPI  
* **Base de Datos**: PostgreSQL, Prisma ORM  
* **Arquitectura**: Clean Architecture, estructura modular (controllers, services, routes, middlewares)  
* **DevOps**: CI/CD con GitHub Actions, Docker, Railway + Vercel (deploy)  

---

## 📦 Características Principales

* 🛒 Carrito funcional sin necesidad de cuenta  
* 💳 Pagos con Stripe (tarjetas, Apple Pay, Google Pay)  
* 💸 Soporte para Zelle y Venmo (con comprobante)  
* 🧾 Generación de órdenes con formulario del cliente  
* 🔐 Panel admin seguro con JWT  
* ✉️ Envío de emails con SendGrid  
* 🖼️ Subida de imágenes directa a Google Cloud Storage  
* 📄 API documentada con Swagger  
* 📱 Diseño responsive para móviles  

---

## 📸 Capturas de Pantalla  

_(Puedes añadir acá imágenes o GIFs como en tu portfolio)_  
- Vista catálogo y carrito  
- Checkout con Stripe  
- Confirmación de compra  
- Panel de administración  

---

## 🛠️ Instalación y Configuración

```bash
# Clonar el repositorio
git clone https://github.com/byehizer/Coinbase.git

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

```.env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/coinbase
STRIPE_SECRET_KEY=tu_clave_secreta_de_stripe
SENDGRID_API_KEY=tu_clave_de_sendgrid
SENDGRID_SENDER=ejemplo@ejemplo.com
JWT_SECRET=clave_para_jwt
FRONTEND_URL=http://localhost:3000
GOOGLE_CLOUD_KEY=Archivo de Google Cloud
BUCKET_NAME=Nombre-del-bucket
```

---

## 🐳 Docker (opcional)

```bash
docker-compose up -d
```

Para detener los servicios:

```bash
docker-compose down
```

---

## 🧱 Migraciones y Seeds

```bash
npx prisma migrate dev
npx prisma db seed
```

---

## 📡 Webhooks y Ngrok

Para pruebas locales con Stripe:

```bash
ngrok http 5000
```

Configurar webhooks en Stripe con:

```txt
https://tu-ngrok-id.ngrok.io/api/stripe/webhook
```

---

## 🧩 Diagrama de Arquitectura  

```txt
[ React (Vercel) ] ⇆ [ Express API (Railway) ] ⇆ [ PostgreSQL (Railway) ]
                                   │
                                   ├── Stripe (Pagos)
                                   ├── SendGrid (Emails)
                                   └── Google Cloud Storage (Imágenes)
```

---

## 📬 API Docs

Disponible en desarrollo en:

```txt
http://localhost:5000/api-docs
```

En producción:

```txt
https://practical-light-production.up.railway.app/api-docs
```

---

## 🧠 Mejoras Futuras

* Manejo avanzado de errores con `boom`  
* Logs estructurados y monitoreo con Sentry  
* Uso de DTOs 

---

## 👤 Autor

* **Ehizer Jesus Valero Bastidas**  
* GitHub: [byehizer](https://github.com/byehizer)  
* Proyecto personal full-stack  
