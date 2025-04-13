import { UserService } from "../services/user.service.js";
import { hashPassword } from "../utils/hash.js";

export class UserController {
  static async getAll(req, res) {
    try {
      const users = await UserService.getAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({
        error: "There was an error",
        details: error.message,
      });
    }
  }

  static async create(req, res) {
    const { name, email, password, role } = req.body;

    if (role && role !== "admin") {
      return res.status(400).json({
        error: "Invalid role.",
      });
    }

    try {
      const existingUser = await UserService.getByEmail(email);
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "The email is already registered." });
      }

      const passwordHash = hashPassword(password);
      const newUser = await UserService.create({
        name,
        email,
        password: passwordHash,
        role: role || "admin",
      });

      res.status(201).json({
        message: "User saved",
        user: newUser,
      });
    } catch (error) {
      res.status(500).json({
        message: `Error creating user: ${error.message}`,
      });
    }
  }

  static async getById(req, res) {
    const { id_user } = req.params;

    try {
      const user = await UserService.getById(Number(id_user));

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({ user });
    } catch (error) {
      res.status(500).json({
        message: `Error searching for user: ${error.message}`,
      });
    }
  }
}
