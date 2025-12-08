import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const srcRoot = path.resolve(__dirname, "src");
const distDir = path.resolve(__dirname, "dist");

export default defineConfig({
  root: srcRoot,
  plugins: [react()],
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "../..", "packages/shared/src"),
      "convex/_generated": path.resolve(__dirname, "../..", "convex/_generated"),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    outDir: distDir,
    emptyOutDir: true,
  },
});
