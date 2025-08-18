import { vi } from 'vitest';

// Mock de authenticate middleware
vi.mock("../../src/middlewares/authenticate.js", () => ({
  authenticate: (req, res, next) => {
    req.user = { id_user: 1, role: "admin", name: "Mock User" };
    next();
  },
}));

// Mock de authorization middleware
vi.mock("../../src/middlewares/authorization.js", () => ({
  authorization: (...roles) => (req, res, next) => {
    req.user = req.user || { role: "admin" };
    next();
  },
}));

// Mock de Google Cloud Storage service
vi.mock("../../src/services/googleStorage.service.js", () => ({
  uploadFromBuffer: vi.fn(() => {
    return Promise.resolve("https://fake-url.com/img.jpg");
  }),
  deleteFile: vi.fn(() => Promise.resolve()),
}));

vi.mock("../../src/utils/email.js", () => ({
  sendRejectionEmail: vi.fn(),
}));


