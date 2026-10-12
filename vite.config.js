import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // VITE_* is the standard prefix. REACT_APP_* is still read so the existing
  // REACT_APP_BASE_URL setting on Vercel keeps working after the move from CRA.
  envPrefix: ["VITE_", "REACT_APP_"],
  server: {
    // The server's CORS allow-list expects the local client on port 3001.
    port: 3001,
  },
  build: {
    // Same output folder as Create React App, so the Vercel project settings
    // keep working without changes.
    outDir: "build",
    // The main chunk is ~175 kB gzipped, mostly react-dom and react-router.
    // The editor (Monaco) is already split into its own lazy chunk.
    chunkSizeWarningLimit: 600,
  },
});
