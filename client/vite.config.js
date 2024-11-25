// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";

// import NodeGlobalsPolyfillPlugin from "@esbuild-plugins/node-globals-polyfill";

// // https://vite.dev/config/
// export default defineConfig({
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://localhost:3000",
//         secure: false,
//       },
//     },
//   },
//   plugins: [react()],
//   define: {
//     global: "window", // Ajoutez cette ligne pour résoudre l'erreur
//   },

// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        secure: false,
      },
    },
  },
  plugins: [react()],
});
