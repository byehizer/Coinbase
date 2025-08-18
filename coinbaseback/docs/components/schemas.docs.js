/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Billete raro 1910
 *         description:
 *           type: string
 *           example: Billete antiguo en excelente estado
 *         year:
 *           type: integer
 *           example: 1910
 *         country_origin:
 *           type: string
 *           example: Argentina
 *         price:
 *           type: number
 *           format: float
 *           example: 3500.50
 *         stock:
 *           type: integer
 *           example: 10
 *         deleted:
 *           type: boolean
 *           example: false
 *         image_url:
 *           type: string
 *           nullable: true
 *           example: /uploads/billete1-394823.png
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         client_name:
 *           type: string
 *           example: Juan Perez
 *         client_email:
 *           type: string
 *           example: juan@example.com
 *         order_date:
 *           type: string
 *           format: date-time
 *           example: 2025-08-01T12:00:00Z
 *         total:
 *           type: number
 *           format: float
 *           example: 3500.50
 *         status:
 *           type: string
 *           enum: [pending, paid, shipped, delivered, cancelled]
 *           example: pending
 *         payment:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: integer
 *               example: 10
 *             method:
 *               type: string
 *               enum: [Stripe, PayPal, Venmo, Zelle, Credit_Card, Debit_Card, Apple_Pay, Google_Pay]
 *               example: Stripe
 *             status:
 *               type: string
 *               enum: [pending, approved, rejected, refunded]
 *               example: approved
 *             receipt:
 *               type: string
 *               nullable: true
 *             paymentIntentId:
 *               type: string
 *               nullable: true
 *             chargeId:
 *               type: string
 *               nullable: true
 *         delivery:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: integer
 *               example: 5
 *             address:
 *               type: string
 *               example: Calle Falsa 123
 *             city:
 *               type: string
 *               example: Buenos Aires
 *             country:
 *               type: string
 *               example: Argentina
 *             status:
 *               type: string
 *               enum: [pending, in_transit, delivered]
 *               example: pending
 *         OrderDetail:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id_order_detail:
 *                 type: integer
 *                 example: 100
 *               id_product:
 *                 type: integer
 *                 nullable: true
 *                 example: 3
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               price_unit:
 *                 type: number
 *                 format: float
 *                 example: 1500.25
 *               product_name:
 *                 type: string
 *                 nullable: true
 *                 example: Billete antiguo 1920
 *               product_image_url:
 *                 type: string
 *                 nullable: true
 *                 example: https://ejemplo.com/billete1.jpg
 */
