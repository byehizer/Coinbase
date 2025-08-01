export function validateCreateOrder(req, res, next) {
  const {
    client_name,
    client_email,
    total,
    payment_method,
    address,
    city,
    country,
    items,
  } = req.body;

  if (!client_name || client_name.trim().length < 3) {
    return res.status(400).json({ error: "Name is required (min 3 characters)" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!client_email || !emailRegex.test(client_email)) {  
    return res.status(400).json({ error: "Valid email is required" });
  }

  if (!total || isNaN(total) || total <= 0) {
    return res.status(400).json({ error: "Total amount must be greater than 0" });
  }

  if (!payment_method) {
    return res.status(400).json({ error: "Payment method is required" });
  }

  if (!address || address.trim().length < 5) {
    return res.status(400).json({ error: "Address must be at least 5 characters" });
  }

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  if (!country || !/^[a-zA-Z\s]+$/.test(country)) {
    return res.status(400).json({ error: "Valid country is required" });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "At least one product is required" });
  }
  next();
}
