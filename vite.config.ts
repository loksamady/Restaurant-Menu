import { defineConfig, loadEnv } from "vite";
import path from "node:path";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isHttps = process.env.VITE_HTTPS === "true";

  return {
    server: {
      host: "0.0.0.0", // Allow access from other devices
      port: 3000, // Default Vite port
      https: isHttps ? {} : false, // Enable HTTPS when VITE_HTTPS=true
    },
    resolve: {
      alias: {
        "@src": path.resolve(__dirname, "src"),
      },
    },
    plugins: [react()],
    build: {
      outDir: "dist-ecatalog",
    },
    define: {
      "process.env.APP_API_URL": JSON.stringify(env.APP_API_URL),
    },
  };
});
