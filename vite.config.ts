export default defineConfig({
  base: "./", // <-- Use "./" WITH HashRouter
  server: { host: "::", port: 8080 },
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
