import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import ogImage from "vite-plugin-react-og-image";
import { readFile } from "fs/promises";

// https://vite.dev/config/
export default defineConfig(async (configEnv) => {
  const env = loadEnv(configEnv.mode, process.cwd());
  return {
    base: "/fake-sdgs-generator/",
    plugins: [
      react(),
      tailwindcss(),
      ogImage({
        host: env.VITE_OG_HOST,
        imageResponseOptions: {
          fonts: [
            {
              name: "Geist",
              data: await readFile(
                "node_modules/@fontsource/geist/files/geist-latin-700-normal.woff",
              ),
            },
          ],
        },
      }),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom"],
          },
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
