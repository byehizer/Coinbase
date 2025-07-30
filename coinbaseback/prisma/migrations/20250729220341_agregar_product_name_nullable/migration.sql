-- DropForeignKey
ALTER TABLE "OrderDetail" DROP CONSTRAINT "OrderDetail_id_product_fkey";

-- AlterTable
ALTER TABLE "OrderDetail" ADD COLUMN     "product_image_url" TEXT,
ADD COLUMN     "product_name" TEXT,
ALTER COLUMN "id_product" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_id_product_fkey" FOREIGN KEY ("id_product") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
