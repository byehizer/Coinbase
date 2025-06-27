-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'cancelled';

-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'Stripe';

-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'refunded';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "chargeId" TEXT,
ADD COLUMN     "paymentIntentId" TEXT;
