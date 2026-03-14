// =============================================
// Vite Configuration
// Dev server proxy + path alias setup
// =============================================

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  // path alias so we can use @/ imports
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // proxy API calls to our Express backend running on port 5000
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
