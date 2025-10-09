import { defineConfig } from "vite";
import motionCanvas from "@motion-canvas/vite-plugin";
import copy from "rollup-plugin-copy";

export default defineConfig({
  plugins: [
    motionCanvas({
      project: ["./src/hexagons.ts",
        "./src/posit_footer.ts",
        "./src/posit-logo.ts",
        "./src/shiny-ellmer.ts",
        "./src/infosec-triad.ts",
        "./src/multi-database.ts"
      // "./src/test_scene_new.ts"
  ],
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        dir: "../dist/animations",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]"
      },  
      plugins: [
      ],
    },
  },
});
