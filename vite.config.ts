import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/feedreader',
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: "https://localhost:7777/",
                changeOrigin: true,
                //rewrite: (path) => path.replace(/\/dashboard/, ''),
                secure: false
            }
        }
    }
})
