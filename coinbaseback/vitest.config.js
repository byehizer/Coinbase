import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./test/setup.js"],
    envFile: ".envtest",
    testTimeout: 20000,
    sequence: {
      concurrent: false, // No correr en paralelo
      shuffle: false, // No mezclar el orden
    },
    pool: "threads",
    poolOptions: {
      threads: {
        maxThreads: 1, // 🚫 evita que Vitest corra en paralelo
        minThreads: 1, // opcional, asegura que siempre sea solo 1
      },
    },
  },
});
