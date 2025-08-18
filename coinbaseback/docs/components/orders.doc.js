/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Obtener todas las órdenes (solo admin)
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     description: Devuelve todas las órdenes con detalles de pago y entrega. Solo accesible para administradores autenticados.
 *     responses:
 *       200:
 *         description: Lista de órdenes con detalles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /orders/{id_order}:
 *   get:
 *     summary: Obtener una orden por ID (solo admin)
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_order
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Detalle de la orden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 clientName:
 *                   type: string
 *                   example: Juan Perez
 *                 clientEmail:
 *                   type: string
 *                   example: juan@example.com
 *                 orderDate:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-08-01T12:00:00Z
 *                 total:
 *                   type: number
 *                   format: float
 *                   example: 3500.50
 *                 status:
 *                   type: string
 *                   enum: [pending, paid, shipped, delivered, cancelled]
 *                   example: pending
 *                 paymentMethod:
 *                   type: string
 *                   nullable: true
 *                   enum: [Stripe, PayPal, Venmo, Zelle, Credit_Card, Debit_Card, Apple_Pay, Google_Pay]
 *                   example: Stripe
 *                 trackingStatus:
 *                   type: string
 *                   nullable: true
 *                   enum: [pending, in_transit, delivered]
 *                   example: pending
 *                 address:
 *                   type: string
 *                   example: Calle Falsa 123
 *                 city:
 *                   type: string
 *                   example: Buenos Aires
 *                 country:
 *                   type: string
 *                   example: Argentina
 *                 receipt:
 *                   type: string
 *                   nullable: true
 *                   example: https://example.com/receipt123.pdf
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Billete antiguo 1920
 *                       image:
 *                         type: string
 *                         nullable: true
 *                         example: https://ejemplo.com/billete1.jpg
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *                       unitPrice:
 *                         type: number
 *                         format: float
 *                         example: 1500.25
 *       404:
 *         description: Orden no encontrada
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crear una nueva orden
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - client_name
 *               - client_email
 *               - total
 *               - payment_method
 *               - address
 *               - city
 *               - country
 *               - items
 *             properties:
 *               client_name:
 *                 type: string
 *                 example: Juan Perez
 *               client_email:
 *                 type: string
 *                 format: email
 *                 example: juan@example.com
 *               total:
 *                 type: number
 *                 format: float
 *                 example: 3500.50
 *               payment_method:
 *                 type: string
 *                 enum: [Stripe, PayPal, Venmo, Zelle, Credit_Card, Debit_Card, Apple_Pay, Google_Pay]
 *                 example: Stripe
 *               address:
 *                 type: string
 *                 example: Calle Falsa 123
 *               city:
 *                 type: string
 *                 example: Buenos Aires
 *               country:
 *                 type: string
 *                 example: Argentina
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - id
 *                     - name
 *                     - quantity
 *                     - price
 *                     - image_url
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 6
 *                     name:
 *                       type: string
 *                       example: Monedas Antiguas De Uruguay Grandes 1,10,100 Pesos
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 13
 *                     image_url:
 *                       type: string
 *                       example: /uploads/D_NQ_NP_800557-MLA81894398470_012025-O-1753764819079-249545602.webp
 *     responses:
 *       201:
 *         description: Orden creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order created successfully
 *                 order:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 123
 *                     client_name:
 *                       type: string
 *                       example: Juan Perez
 *                     client_email:
 *                       type: string
 *                       format: email
 *                       example: juan@example.com
 *                     total:
 *                       type: number
 *                       format: float
 *                       example: 3500.50
 *                     status:
 *                       type: string
 *                       enum: [pending, paid, shipped, delivered, cancelled]
 *                       example: pending
 *                     id_delivery:
 *                       type: integer
 *                       example: 10
 *                     id_payment:
 *                       type: integer
 *                       example: 15
 *       400:
 *         description: Validación fallida (datos inválidos)
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /orders/{id_order}:
 *   put:
 *     summary: Actualizar una orden existente (solo admin)
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_order
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden a actualizar
 *     requestBody:
 *       description: Datos para actualizar la orden, entrega y estado de seguimiento
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientName:
 *                 type: string
 *                 example: Juan Perez
 *                 description: Nombre del cliente
 *               clientEmail:
 *                 type: string
 *                 format: email
 *                 example: juan@example.com
 *                 description: Email del cliente
 *               status:
 *                 type: string
 *                 enum: [pending, paid, shipped, delivered, cancelled]
 *                 example: shipped
 *                 description: Estado de la orden
 *               trackingStatus:
 *                 type: string
 *                 enum: [pending, in_transit, delivered]
 *                 example: in_transit
 *                 description: Estado de seguimiento/entrega
 *               deliveryAddress:
 *                 type: string
 *                 example: Calle Falsa 123
 *                 description: Dirección de entrega
 *               deliveryCity:
 *                 type: string
 *                 example: Buenos Aires
 *                 description: Ciudad de entrega
 *               deliveryCountry:
 *                 type: string
 *                 example: Argentina
 *                 description: País de entrega
 *             required:
 *               - clientName
 *               - clientEmail
 *     responses:
 *       200:
 *         description: Orden actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 123
 *                 client_name:
 *                   type: string
 *                   example: Juan Perez
 *                 client_email:
 *                   type: string
 *                   format: email
 *                   example: juan@example.com
 *                 order_date:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-08-01T12:00:00Z
 *                 total:
 *                   type: number
 *                   format: float
 *                   example: 3500.50
 *                 status:
 *                   type: string
 *                   enum: [pending, paid, shipped, delivered, cancelled]
 *                   example: shipped
 *                 payment:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     method:
 *                       type: string
 *                       enum: [Stripe, PayPal, Venmo, Zelle, Credit_Card, Debit_Card, Apple_Pay, Google_Pay]
 *                       example: Stripe
 *                     status:
 *                       type: string
 *                       enum: [pending, approved, rejected, refunded]
 *                       example: approved
 *                     receipt:
 *                       type: string
 *                       nullable: true
 *                     paymentIntentId:
 *                       type: string
 *                       nullable: true
 *                     chargeId:
 *                       type: string
 *                       nullable: true
 *                 delivery:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     address:
 *                       type: string
 *                       example: Calle Falsa 123
 *                     city:
 *                       type: string
 *                       example: Buenos Aires
 *                     country:
 *                       type: string
 *                       example: Argentina
 *                     status:
 *                       type: string
 *                       enum: [pending, in_transit, delivered]
 *                       example: in_transit
 *                 OrderDetail:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_order_detail:
 *                         type: integer
 *                         example: 100
 *                       id_product:
 *                         type: integer
 *                         nullable: true
 *                         example: 3
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *                       price_unit:
 *                         type: number
 *                         format: float
 *                         example: 1500.25
 *                       product_name:
 *                         type: string
 *                         nullable: true
 *                         example: Billete antiguo 1920
 *                       product_image_url:
 *                         type: string
 *                         nullable: true
 *                         example: https://ejemplo.com/billete1.jpg
 *       400:
 *         description: Validación fallida (datos inválidos)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid order ID"
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Orden no encontrada
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /orders/{id_order}:
 *   delete:
 *     summary: Eliminar una orden y sus datos asociados (solo admin)
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_order
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden a eliminar
 *     responses:
 *       200:
 *         description: Orden eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order deleted successfully
 *                 order:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 123
 *                     id_payment:
 *                       type: integer
 *                       nullable: true
 *                       example: 15
 *                     id_delivery:
 *                       type: integer
 *                       nullable: true
 *                       example: 10
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid order ID
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Orden no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Order not found
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /orders/{id}/accept:
 *   patch:
 *     summary: Aprobar una orden pendiente (solo admin)
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden a aprobar
 *     responses:
 *       200:
 *         description: Orden aprobada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Error de validación (orden no pendiente o stock insuficiente)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Not enough stock for product Billete antiguo 1920
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Orden no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Order not found
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /orders/{id}/reject:
 *   patch:
 *     summary: Rechazar una orden pendiente (solo admin)
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden a rechazar
 *     responses:
 *       200:
 *         description: Orden rechazada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order rejected.
 *       400:
 *         description: Error de validación (orden no pendiente)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Order is not in pending state
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Orden no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Order not found
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /orders/{orderId}/refund:
 *   patch:
 *     summary: Iniciar reembolso de una orden (solo admin)
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden para la cual iniciar el reembolso
 *     responses:
 *       200:
 *         description: Reembolso iniciado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reembolso iniciado
 *                 refund:
 *                   type: object
 *                   description: Detalles del objeto refund devuelto por Stripe
 *       400:
 *         description: Orden ya fue reembolsada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: La orden ya fue reembolsada
 *       404:
 *         description: Orden o pago válido no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No se encontró el pago válido para reembolso
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor al procesar el reembolso
 */

/**
 * @swagger
 * /orders/{id}/upload-receipt:
 *   post:
 *     summary: Subir comprobante de pago para una orden
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - email
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen del comprobante
 *               email:
 *                 type: string
 *                 example: cliente@example.com
 *                 description: Email del cliente para verificar identidad
 *     responses:
 *       200:
 *         description: Comprobante subido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 receipt:
 *                   type: string
 *                   example: /uploads/receipt123.jpg
 *                 message:
 *                   type: string
 *                   example: Receipt uploaded successfully
 *                 payment:
 *                   type: object
 *       400:
 *         description: Datos inválidos o no se puede subir comprobante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No file uploaded
 *       403:
 *         description: Email no coincide con la orden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized: Email does not match order"
 *       404:
 *         description: Orden o pago no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Order not found
 *       500:
 *         description: Error interno del servidor al subir comprobante
 */


/**
 * @swagger
 * /orders/public/{id}:
 *   post:
 *     summary: Obtener una orden pública por ID y email
 *     tags:
 *       - Orders
 *     requestBody:
 *       description: Email del cliente para validar acceso a la orden
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@example.com
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden a consultar
 *     responses:
 *       200:
 *         description: Orden encontrada y accesible
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 clientName:
 *                   type: string
 *                   example: Juan Perez
 *                 clientEmail:
 *                   type: string
 *                   format: email
 *                   example: juan@example.com
 *                 orderDate:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-08-01T12:00:00Z
 *                 total:
 *                   type: number
 *                   format: float
 *                   example: 3500.50
 *                 status:
 *                   type: string
 *                   enum: [pending, paid, shipped, delivered, cancelled]
 *                   example: pending
 *                 paymentMethod:
 *                   type: string
 *                   nullable: true
 *                   example: Stripe
 *                 trackingStatus:
 *                   type: string
 *                   nullable: true
 *                   example: pending
 *                 address:
 *                   type: string
 *                   example: Calle Falsa 123
 *                 city:
 *                   type: string
 *                   example: Buenos Aires
 *                 country:
 *                   type: string
 *                   example: Argentina
 *                 receipt:
 *                   type: string
 *                   nullable: true
 *                   example: /uploads/receipt123.jpg
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Billete antiguo 1920
 *                       image:
 *                         type: string
 *                         nullable: true
 *                         example: https://ejemplo.com/billete1.jpg
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *                       unitPrice:
 *                         type: number
 *                         format: float
 *                         example: 1500.25
 *       403:
 *         description: Email no autorizado o no coincide con la orden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No autorizado
 *       404:
 *         description: Orden no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Orden no encontrada
 *       500:
 *         description: Error interno del servidor
 */

