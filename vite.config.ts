// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import * as path from "node:path";
import * as url from "node:url";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(
        path.dirname(url.fileURLToPath(import.meta.url)),
        "./src",
      ),
    },
  },
  test: {
    environment: "jsdom",
  },
});
