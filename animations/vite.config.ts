import { defineConfig } from "vite";
import motionCanvas from "@motion-canvas/vite-plugin";
import copy from "rollup-plugin-copy";

export default defineConfig({
  plugins: [
    motionCanvas({
      project: [
        "./src/project.ts", 
        "./src/project2.ts",
        "./src/hexagons.ts",
        "./src/posit_footer.ts",
        "./src/posit-logo.ts",
        "./src/kayak.ts",
        "./src/quarto_mc.ts",
        "./src/pipeline.ts",
      ],
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // dir: "../public/animations",
        dir: "../dist/animations",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]"
      },  
      plugins: [
        // copy({
        //   targets: [
        //     { 
        //       src: '../public/animations/*', 
        //       dest: '../dist/animations/' 
        //     },
        //     { 
        //       src:  '../public/animations/_fonts/*', 
        //       dest: '../dist/public/_fonts/' 
        //     }
        //   ],
        //   hook: 'writeBundle' // run the plugin after the bundle is written
        // })
      ],
    },
  },
});
