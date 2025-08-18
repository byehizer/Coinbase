/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtener todos los productos disponibles
 *     tags:
 *       - Products
 *     description: Devuelve un array con todos los productos que no están eliminados.
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Billete antiguo 1920
 *                   description:
 *                     type: string
 *                     nullable: true
 *                     example: Billete raro de colección
 *                   year:
 *                     type: integer
 *                     example: 1920
 *                   country_origin:
 *                     type: string
 *                     example: Argentina
 *                   price:
 *                     type: number
 *                     format: float
 *                     example: 2500.00
 *                   stock:
 *                     type: integer
 *                     example: 5
 *                   deleted:
 *                     type: boolean
 *                     example: false
 *                   image_url:
 *                     type: string
 *                     nullable: true
 *                     example: https://ejemplo.com/billete1.jpg
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags:
 *       - Products
 *     description: Devuelve un único producto si existe.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a obtener
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Billete antiguo 1920
 *                 description:
 *                   type: string
 *                   nullable: true
 *                   example: Billete raro de colección
 *                 year:
 *                   type: integer
 *                   example: 1920
 *                 country_origin:
 *                   type: string
 *                   example: Argentina
 *                 price:
 *                   type: number
 *                   format: float
 *                   example: 2500.00
 *                 stock:
 *                   type: integer
 *                   example: 5
 *                 deleted:
 *                   type: boolean
 *                   example: false
 *                 image_url:
 *                   type: string
 *                   nullable: true
 *                   example: https://ejemplo.com/billete1.jpg
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - year
 *               - country_origin
 *               - price
 *               - stock
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: Billete raro 1910
 *               description:
 *                 type: string
 *                 example: Billete antiguo de colección en excelente estado
 *               year:
 *                 type: integer
 *                 example: 1910
 *               country_origin:
 *                 type: string
 *                 example: Argentina
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 3500.50
 *               stock:
 *                 type: integer
 *                 example: 10
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product created successfully
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Campos inválidos o imagen no soportada
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtener todos los productos disponibles
 *     tags:
 *       - Products
 *     description: Devuelve un array con todos los productos que no están eliminados.
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags:
 *       - Products
 *     description: Devuelve un único producto si existe.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a obtener
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - year
 *               - country_origin
 *               - price
 *               - stock
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: Billete raro 1910
 *               description:
 *                 type: string
 *                 example: Billete antiguo de colección en excelente estado
 *               year:
 *                 type: integer
 *                 example: 1910
 *               country_origin:
 *                 type: string
 *                 example: Argentina
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 3500.50
 *               stock:
 *                 type: integer
 *                 example: 10
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product created successfully
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Campos inválidos o imagen no soportada
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
*/

/**
 * @swagger
 * /products/{id_product}:
 *   put:
 *     summary: Actualizar un producto existente
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     description: Solo accesible por administradores. Permite actualizar un producto, incluyendo su imagen.
 *     parameters:
 *       - in: path
 *         name: id_product
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - year
 *               - country_origin
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: Billete raro actualizado
 *               description:
 *                 type: string
 *                 example: Nueva descripción del billete
 *               year:
 *                 type: integer
 *                 example: 1925
 *               country_origin:
 *                 type: string
 *                 example: Uruguay
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 4000.00
 *               stock:
 *                 type: integer
 *                 example: 8
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product updated successfully
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */


/**
 * @swagger
 * /products/{id_product}:
 *   delete:
 *     summary: Eliminar (soft delete) un producto
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     description: 
 *       Elimina lógicamente un producto (cambia el campo `deleted` a true). 
 *       Solo accesible por administradores autenticados. Si el producto no está asociado a órdenes, se elimina su imagen.
 *     parameters:
 *       - in: path
 *         name: id_product
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente (soft delete)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */

