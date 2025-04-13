import { UserService } from "../services/user.service.js";
import { verifyPassword } from "../utils/hash.js";
import { createToken, verifyToken } from "../utils/jwt.js";

export class AuthController {
  static async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await UserService.getByEmail({ email });

      if (!user) {
        return res.status(401).json({ error: "The user doesn't exist" });
      }
      const isPasswordCorrect = await verifyPassword(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ error: "The password isn't correct" });
      }

      const token = createToken({
        userId: user.id_user,
        email: user.email,
        role: user.role,
      });

      res.json({
        mensaje: "Login Successful",
        token,
      });
    } catch (error) {
      res.json({
        error: "Hubo un error al registrar el usuario",
        detail: error.message,
      });
    }
  }
  static async profile(req, res) {
    try {
      res.json({
        user: req.user, // Ya está en req.user gracias al middleware
      });
    } catch (error) {
      res.json({
        error: "Hubo un error al mostrar el perfil",
        detail: error.message,
      });
    }
  }
}
