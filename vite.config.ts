import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: "/", // <-- FIXED for nillyrahma70-pixel.github.io user site
  server: { host: "::", port: 8080 },
  plugins: [react()],
  resolve: { 
    alias: { 
      "@": path.resolve(__dirname, "./src") 
    } 
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
  }
});
