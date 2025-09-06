import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


export default defineConfig({
  server:{
    proxy:{
      '/api/v1' : {target: 'http://localhost:4000', changeOrigin: true}
    }
  },
  plugins: [react(), tailwindcss(
    {
      content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"] 
    }
  )],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
})
