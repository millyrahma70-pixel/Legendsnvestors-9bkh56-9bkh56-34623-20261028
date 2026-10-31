import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: "/", // <-- FIX: "/" not "./" for millyrahma70-pixel.github.io
  server: { host: "::", port: 8080 },
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
