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
* [🛠️ Instalación y Configuración](#%EF%B8%8F-instalación-y-configuración)  
* [🧩 Diagrama de Arquitectura](#-diagrama-de-arquitectura)  
* [📬 API Docs](#-api-docs)
* [🧪 Tests](#-tests)  
* [🧠 Mejoras Futuras](#-mejoras-futuras)  
* [👤 Autor](#-autor)  

---

## 🌍 Demo Online  
[![Frontend Vercel](https://img.shields.io/badge/Frontend-Vercel-blue?logo=vercel)](https://coinbase-sandy-xi.vercel.app)  
[![Backend Railway](https://img.shields.io/badge/Backend-Railway-green?logo=railway)](https://practical-light-production.up.railway.app)  

🔑 **Panel Admin**  
Se accede desde:    https://coinbase-sandy-xi.vercel.app/admin

- Usuario: `admin@admin.com`  
- Contraseña: `admin123`  

---

## 🚀 Tecnologías Utilizadas

- **Frontend**: ![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
- **Backend**: ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-black?logo=JSON%20web%20tokens)  
- **Base de Datos**: ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)  
- **DevOps**: ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white) ![Railway](https://img.shields.io/badge/Railway-0B0D0E?logo=railway&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)   

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
  <img width="1904" height="944" alt="image" src="https://github.com/user-attachments/assets/48bde10d-6524-458a-a9ea-cb052da57bd4" />
- Checkout con Stripe
  <img width="1141" height="896" alt="image" src="https://github.com/user-attachments/assets/08410b02-cc07-4c32-984a-3e6fa1628752" />
- Confirmación de compra
  <img width="1904" height="940" alt="image" src="https://github.com/user-attachments/assets/a82103cc-aac4-452a-af36-5273a825d1dd" />
- Panel de administración  
  <img width="1918" height="941" alt="image" src="https://github.com/user-attachments/assets/e76e8be5-9f62-4b88-9cfd-6cf784bd5504" />

---

## 🛠️ Instalación y Configuración

1. **Clonar el repositorio**
```bash
git clone https://github.com/byehizer/Coinbase.git
cd Coinbase
```

2. **Levantar la base de datos con Docker** (si usas PostgreSQL en contenedor)
```bash
docker-compose up -d
```
Para detener los servicios:
```bash
docker-compose down
```

3. **Crear el archivo `.env` en la carpeta `backend/`**  
(asegúrate de que exista antes de correr migraciones)
```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/coinbase
STRIPE_SECRET_KEY=tu_clave_secreta_de_stripe
SENDGRID_API_KEY=tu_clave_de_sendgrid
SENDGRID_SENDER=ejemplo@ejemplo.com
JWT_SECRET=clave_para_jwt
FRONTEND_URL=http://localhost:3000
GOOGLE_CLOUD_KEY='{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}'
BUCKET_NAME=Nombre-del-bucket
```

4. **Instalar dependencias**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

5. **Ejecutar migraciones y seeds**  
Esto crea las tablas y (opcionalmente) inserta datos iniciales.
```bash
cd backend
npx prisma migrate dev
npx prisma db seed   # opcional, solo si quieres datos de ejemplo
```

6. **Iniciar los servidores**
```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```
##  Webhooks y Ngrok

Para pruebas locales con Stripe, es necesario tener instalado ngrok: https://ngrok.com/

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

---

## 🧪 Tests

Los tests se ejecutan con **Vitest**.  
Para mantener aislada la base de datos de producción se utiliza **SQLite** como motor en los tests.  

1. Crear un archivo `.env.test` en la carpeta `backend/` con algo como:  
```env
DATABASE_URL="file:./dev.test.db"
JWT_SECRET=clave_para_jwt
```

2. Generar el schema de prueba:  
```bash
cd backend
npx prisma migrate dev --name init --schema=prisma/schema.test.prisma
```

3. Ejecutar los tests:  
```bash
npm run test
```

El script `test` usa Vitest en modo secuencial (`--runInBand`) para evitar conflictos con la base de datos.  
