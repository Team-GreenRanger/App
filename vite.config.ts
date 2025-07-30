import { defineConfig } from "vite";
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig(({ mode }) => {
  return {
    define: {
      "import.meta.env.MODE": JSON.stringify(mode),
    },
    build: {
      outDir: "dist",
      assetsDir: "assets",
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
    server: {
      port: 6969,
      host: true,
    },
    base: "./",
    plugins: [viteSingleFile()],
  };
});
