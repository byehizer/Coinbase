import { UserService } from "../services/user.service.js";
import { hashPassword, verifyPassword } from "../utils/hash.js";
import { createToken } from "../utils/jwt.js";

export class AuthController {
  static async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await UserService.getByEmail({ email });
      if (!user) {
        return res.status(401).json({ error: "El usuario no existe" });
      }
      const isPasswordCorrect = await verifyPassword(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ error: "La contraseña no es correcta" });
      }

      const token = createToken({
        userId: user.id_user,
        email: user.email,
        role: user.role,
      });

      res.status(200).json({
        mensaje: "Login exitoso",
        token,
      });
    } catch (error) {
      res.status(500).json({
        error: "Hubo un error al procesar la solicitud",
        detail: error.message,
      });
    }
  }

  static async profile(req, res) {
    try {
      res.status(200).json({
        user: req.user, // Ya está en req.user gracias al middleware
      });
    } catch (error) {
      res.status(500).json({
        error: "Hubo un error al mostrar el perfil",
        detail: error.message,
      });
    }
  }
}
