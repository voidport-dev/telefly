import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  },
  css: {
    devSourcemap: true,
  },
});
