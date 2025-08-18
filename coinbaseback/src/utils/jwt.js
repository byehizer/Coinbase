import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

const SECRET = process.env.JWT_SECRET;


if (!SECRET) {
  throw new Error("No se ha definido la variable JWT_SECRET en el archivo .env");
}

export function createToken({ id_user, name, email, role }) {
  return jwt.sign(
    {
      id_user: id_user,
      name,
      email,
      role,
    },
    SECRET,
    {
      expiresIn: "10m",
    }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}
