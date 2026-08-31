import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Forwarded to the local Express server (server/index.ts), which
      // holds the Anthropic key and never exposes it to the client.
      "/api": "http://localhost:8787",
    },
  },
});
