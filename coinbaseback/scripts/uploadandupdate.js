import fs from "fs/promises";
import path from "path";
import { uploadFromBuffer } from "../src/services/googleStorage.service.js"; // tu función de upload
import { ProductService } from "../src/services/product.service.js";
import { OrderDetailService } from "../src/services/order_detail.service.js";
import { PaymentService } from "../src/services/payment.service.js";

async function main() {
  await migrateImages();
  await migrateReceipts();
  console.log("Migración de imágenes y recibos finalizada.");
}

main().catch((e) => console.error("Error general:", e));

async function migrateReceipts() {
  const payments = await PaymentService.getAll();

  for (const payment of payments) {
    if (
      payment.receipt &&
      !payment.receipt.startsWith("https://storage.googleapis.com")
    ) {
      const localPath = path.join("uploads", path.basename(payment.receipt));
      try {
        const buffer = await fs.readFile(localPath);
        const mimetype = getMimeType(localPath);

        const newUrl = await uploadFromBuffer(
          buffer,
          path.basename(localPath),
          mimetype
        );

        await PaymentService.update(Number(payment.id), { receipt: newUrl });

        console.log(`Recibo ${payment.id} actualizado con nueva URL.`);
      } catch (error) {
        console.error(`Error procesando recibo ${payment.id}:`, error.message);
      }
    }
  }
}

async function migrateImages() {
  const products = await ProductService.getAll();

  for (const product of products) {
    if (
      product.image_url &&
      !product.image_url.startsWith("https://storage.googleapis.com")
    ) {
      // Supongamos que image_url ahora es ruta local relativa, ej: "uploads/foto1.jpg"
      const localPath = path.join("uploads", path.basename(product.image_url));
      try {
        const buffer = await fs.readFile(localPath);
        const mimetype = getMimeType(localPath); // función para obtener MIME según extensión

        const newUrl = await uploadFromBuffer(
          buffer,
          path.basename(localPath),
          mimetype
        );

        // Actualizar producto con la nueva URL
        await ProductService.update(product.id, { image_url: newUrl });
        await OrderDetailService.updateImageUrlByProductId(product.id, newUrl);

        console.log(`Producto ${product.id} actualizado con nueva URL.`);
      } catch (error) {
        console.error(
          `Error procesando producto ${product.id}:`,
          error.message
        );
      }
    }
  }
}

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}
