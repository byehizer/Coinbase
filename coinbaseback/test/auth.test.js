import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "../src/server.js";
import * as setup from "./helpers/setupauthtest.js";
import * as authUtils from "../src/utils/hash.js";
import { UserService } from "../src/services/user.service.js";
import * as token from "../src/utils/jwt.js";

describe("POST /api/auth/login", () => {
  it("→ 401 si el usuario no existe", async () => {
    vi.spyOn(UserService, "getByEmail").mockResolvedValue(null);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "wrong@example.com", password: "1234" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("El usuario no existe");
  });

  it("→ 401 si la contraseña es incorrecta", async () => {
    vi.spyOn(UserService, "getByEmail").mockResolvedValue(setup.User);
    vi.spyOn(authUtils, "verifyPassword").mockResolvedValue(false);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "wrongpass" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("La contraseña no es correcta");
  });

  it("→ 200 si el login es exitoso", async () => {
    vi.spyOn(UserService, "getByEmail").mockResolvedValue(setup.User);
    vi.spyOn(authUtils, "verifyPassword").mockResolvedValue(true);
    vi.spyOn(token, "createToken").mockReturnValue("fake-jwt-token");

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "correctpass" });

    expect(res.status).toBe(200);
    expect(res.body.mensaje).toBe("Login exitoso");
    expect(res.body.token).toBe("fake-jwt-token");
  });
});
