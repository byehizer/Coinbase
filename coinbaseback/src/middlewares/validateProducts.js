import fs from "fs/promises";

export async function validateProduct(req, res, next) {
  const { name, description, year, country_origin, price, stock } = req.body;

  // Función auxiliar para borrar imagen si existe
  async function deleteFileIfExists() {
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (err) {
        console.error("Error deleting file after validation failure:", err.message);
      }
    }
  }

  if (
    !name?.trim() ||
    !description?.trim() ||
    !year ||
    !country_origin?.trim() ||
    !price ||
    !stock
  ) {
    await deleteFileIfExists();

    return res.status(400).json({
      message: "All fields are required.",
    });
  }

  const parsedYear = parseInt(year, 10);
  const parsedPrice = parseFloat(price);
  const parsedStock = parseInt(stock, 10);
  const currentYear = new Date().getFullYear();

  if (isNaN(parsedYear) || isNaN(parsedPrice) || isNaN(parsedStock)) {
    await deleteFileIfExists();

    return res.status(400).json({
      message: "Year, price, and stock must be valid numbers.",
    });
  }

  if (parsedYear < 1700 || parsedYear > currentYear) {
    await deleteFileIfExists();

    return res.status(400).json({
      message: "Year must be between 1700 and current year.",
    });
  }

  if (parsedPrice <= 0) {
    await deleteFileIfExists();

    return res.status(400).json({
      message: "Price must be greater than 0.",
    });
  }

  if (parsedStock < 0) {
    await deleteFileIfExists();

    return res.status(400).json({
      message: "Stock cannot be negative.",
    });
  }

  // Guardás los valores ya parseados para usarlos en el controlador
  req.validatedProduct = {
    name,
    description,
    year: parsedYear,
    country_origin,
    price: parsedPrice,
    stock: parsedStock,
  };

  next(); // continúa al controlador
}