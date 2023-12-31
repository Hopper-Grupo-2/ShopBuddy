import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],

	server: {
		proxy: {
			"/api": {
				target: "http://localhost:4021/api",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
			"/socket.io": {
				target: "ws://localhost:4021",
				ws: true,
				changeOrigin: true,
			},
		},
	},
});
