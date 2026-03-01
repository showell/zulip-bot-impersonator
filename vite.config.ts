import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  server: {
    port: 7888,
  },
  base:
    mode === "production"
      ? "/zulip-bot-impersonator/"
      : "/",
}));
