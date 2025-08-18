/**
 * @swagger
 * /stripe/checkout:
 *   post:
 *     summary: Crear sesión de pago con Stripe
 *     tags:
 *       - Stripe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - client_name
 *               - client_email
 *               - address
 *               - city
 *               - country
 *               - items
 *               - total
 *             properties:
 *               client_name:
 *                 type: string
 *                 example: Juan Perez
 *               client_email:
 *                 type: string
 *                 format: email
 *                 example: juan@example.com
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
 *                     - name
 *                     - price
 *                     - quantity
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Billete antiguo 1920
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 1500.25
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *               total:
 *                 type: number
 *                 format: float
 *                 example: 3500.50
 *     responses:
 *       200:
 *         description: URL de la sesión de Stripe para redirigir al checkout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: https://checkout.stripe.com/pay/cs_test_a1b2c3d4
 *       400:
 *         description: Datos incompletos o inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Datos incompletos o inválidos
 *       500:
 *         description: Error interno al crear la sesión de Stripe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al crear la sesión de Stripe
 */
