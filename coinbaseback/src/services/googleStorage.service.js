import { Storage } from "@google-cloud/storage";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const keyPath = path.join(process.cwd(), "config", "clave-gcp.json");

const storage = new Storage({
  keyFilename: keyPath,
});

const bucketName = "coinbase_storage-2025"; // reemplazá con el nombre real
const bucket = storage.bucket(bucketName);

export async function uploadFromBuffer(buffer, originalName, mimetype) {
  return new Promise((resolve, reject) => {
    const ext = path.extname(originalName);
    const filename = `${uuidv4()}${ext}`;

    const blob = bucket.file(filename);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: mimetype,
    });

    blobStream.on("error", (err) => reject(err));

    blobStream.on("finish", async () => {

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    blobStream.end(buffer);
  });
}

export async function deleteFile(filename) {
  try {
    await bucket.file(filename).delete();
    console.log(`Archivo ${filename} eliminado correctamente`);
  } catch (error) {
    console.error("Error al eliminar archivo:", error.message);
    throw error;
  }
}
