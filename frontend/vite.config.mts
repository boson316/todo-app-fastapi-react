import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    outDir: "dist",
  },
  // 將 <repo-name> 換成你的 GitHub repo 名稱
  base: "/todo-app-fastapi-react/",
});

