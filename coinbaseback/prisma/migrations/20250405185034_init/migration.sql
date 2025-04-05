-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('pending', 'in_transit', 'delivered');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('PayPal', 'Venmo', 'Zelle', 'Credit_Card', 'Debit_Card', 'Apple_Pay', 'Google_Pay', 'Cripto');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'paid', 'shipped', 'delivered');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin');

-- CreateTable
CREATE TABLE "Delivery" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "receipt" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "year" INTEGER NOT NULL,
    "country_origin" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL,
    "image_url" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "client_name" TEXT NOT NULL,
    "client_email" TEXT NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(10,2) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "id_payment" INTEGER,
    "id_delivery" INTEGER,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderDetail" (
    "id_order_detail" SERIAL NOT NULL,
    "id_order" INTEGER NOT NULL,
    "id_product" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price_unit" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "OrderDetail_pkey" PRIMARY KEY ("id_order_detail")
);

-- CreateTable
CREATE TABLE "User" (
    "id_user" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'admin',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_id_payment_fkey" FOREIGN KEY ("id_payment") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_id_delivery_fkey" FOREIGN KEY ("id_delivery") REFERENCES "Delivery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_id_order_fkey" FOREIGN KEY ("id_order") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_id_product_fkey" FOREIGN KEY ("id_product") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
