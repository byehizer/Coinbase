import jwt from "jsonwebtoken";

const SECRET = "s3cr3t";

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
