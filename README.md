# 🪙 Coinbase - Plataforma de Venta de Billetes Antiguos

Coinbase es una plataforma web desarrollada para la venta de billetes antiguos. Permite a los usuarios comprar sin necesidad de crear una cuenta, gestionar pedidos y pagos de forma sencilla, y cuenta con un panel de administración protegido. El sistema está completamente documentado, probado y listo para producción.

## 🚀 Tecnologías utilizadas

### 🖼️ Frontend
- React.js
- Tailwind CSS
- Fetch API (para consumo de la API)

### ⚙️ Backend
- Node.js
- Express
- JWT (para autenticación del administrador)
- Multer (para subida de imágenes)
- SendGrid (para envío de correos)
- Stripe (para pagos con tarjetas, Apple Pay y Google Pay)
- Swagger (para documentación de la API)

### 🛢️ Base de datos
- PostgreSQL
- Prisma ORM

### 🧱 Arquitectura
- Clean Architecture
- Estructura modular (controladores, servicios, middlewares, rutas, etc.)

## 📦 Características principales

- 🛒 Carrito de compras funcional sin necesidad de registrarse
- 🧾 Creación de órdenes con formulario de datos del cliente
- 💳 Integración con Stripe: pagos con tarjetas, Apple Pay y Google Pay
- 💸 Soporte para Zelle y Venmo mediante carga de comprobante
- 📎 Validación y control del comprobante según estado de la orden
- ✉️ Envío de correos de confirmación de pedido con SendGrid
- 🔐 Panel privado de administrador protegido con JWT
- 📋 Gestión de productos, órdenes, pagos y entregas desde el panel admin
- 🗃️ Subida de imágenes a Backend (localmente en carpeta `/uploads`)
- 📄 Documentación completa de la API con Swagger / OpenAPI
- 📱 Diseño responsive adaptado a dispositivos móviles

## 🧪 Instalación y configuración

### ⚙️ Requisitos previos

- Node.js (v18+ recomendado)
- PostgreSQL
- Cuenta de Stripe
- Cuenta de SendGrid

### 📥 Clonar el repositorio

```
git clone https://github.com/byehizer/Coinbase.git
cd Coinbase
npm install
```

### 🔐 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/coinbase
STRIPE_SECRET_KEY=tu_clave_secreta_de_stripe
SENDGRID_API_KEY=tu_clave_de_sendgrid
SENDGRID_SENDER="ejemplo@ejemplo.com"
JWT_SECRET=una_clave_secreta_para_token
FRONTEND_URL="http://localhost:0000"
```

> 🔎 **Aclaración:**
> - `DATABASE_URL` debe tener la conexión correcta a tu base de datos PostgreSQL.
> - `STRIPE_SECRET_KEY` es la clave secreta de tu cuenta Stripe.
> - `SENDGRID_API_KEY` es la clave API de SendGrid para enviar correos.
> - `JWT_SECRET` es una cadena secreta para firmar los tokens JWT.
> - Las imágenes se guardan localmente en la carpeta `/uploads` del backend, no en servicios externos.

### 🐳 Uso con Docker y docker-compose (opcional)

Si querés correr el backend y la base de datos con Docker, podés usar (configuralo antes):

```
docker-compose up -d
```

Esto levantará los servicios configurados en `docker-compose.yml` (como PostgreSQL y el backend).

Para detener los servicios:

```
docker-compose down
```

> 🛠️ Asegurate de tener Docker y Docker Compose instalados en tu sistema.

### 🧱 Migraciones y seed de la base de datos

Para crear las tablas y estructuras en la base de datos, ejecutá las migraciones de Prisma:

```
npx prisma migrate dev
```

Si tenés un archivo seed para precargar datos iniciales (como productos), podés ejecutarlo con:

```
npx prisma db seed
```

> 💡 **Nota:**  
> Asegurate que la variable `DATABASE_URL` en `.env` esté correctamente configurada antes de correr estas órdenes.

## 🌐 Frontend y conexión con Stripe

El frontend de Coinbase corre por separado. Asegurate de que el valor de `FRONTEND_URL` en tu `.env` del backend apunte correctamente al dominio o puerto donde corre el frontend.

En entorno de desarrollo, podés correr el frontend por ejemplo en:

```
npm run dev
```

Desde otra carpeta, si está en React o Next.js.

### 📡 Uso de ngrok para Stripe (desarrollo local)

Para recibir webhooks de Stripe en desarrollo local (cuando estás trabajando en `localhost`), podés usar [ngrok](https://ngrok.com/):

```
ngrok http 5000
```

Esto te generará una URL pública como:

```
https://8f3c-xx-xx-xx-xx.ngrok.io
```

Usá esa URL en el panel de Stripe para configurar tus webhooks, por ejemplo:

```
https://8f3c-xx-xx-xx-xx.ngrok.io/api/stripe/webhook
```

> 🔐 Asegurate de que `STRIPE_WEBHOOK_SECRET` esté correctamente configurado si estás verificando firmas en tu backend.

---

### ▶️ Ejecutar el servidor en desarrollo

Para iniciar el servidor backend en modo desarrollo, usá el siguiente comando:

```
npm run dev
```

