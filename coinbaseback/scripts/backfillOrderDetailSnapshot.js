import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const orderDetails = await prisma.orderDetail.findMany({
    where: {
      product_name: null,
    },
    include: { product: true },
  });

  console.log(`Encontradas ${orderDetails.length} órdenes a actualizar`);

  for (const detail of orderDetails) {
    if (detail.product) {
      await prisma.orderDetail.update({
        where: { id_order_detail: detail.id_order_detail },
        data: {
          product_name: detail.product.name,
          product_image_url: detail.product.image_url,
        },
      });
    }
  }

  console.log("Actualización completada.");
}

main()
  .catch((e) => {
    console.error("Error al ejecutar el script:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
