import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function uploadSingleProductImage() {
   
    const uploadPath = path.join(__dirname, "../../uploads/products");
    
    // crea la carpeta uploads/products si no existe
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadPath); // Guardamos en uploads/products
        },
        filename: function (req, file, cb) {
            const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const ext = path.extname(file.originalname);
            cb(null, uniqueName + ext); // ej: 1713208421-238472.jpg
        },
    });

    return multer({ storage }).single("image");

}