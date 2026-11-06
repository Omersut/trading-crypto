import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// outDir "build" keeps the existing Vercel project settings (Create React App preset) working.
export default defineConfig({
  plugins: [react()],
  build: { outDir: "build" },
});
