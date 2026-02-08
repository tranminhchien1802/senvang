import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    },
    // Cấu hình để hỗ trợ đồng bộ dữ liệu nhanh
    hmr: {
      overlay: false // Tắt overlay lỗi để không làm phiền khi phát triển
    }
  },
  build: {
    // Cấu hình để đảm bảo dữ liệu được cập nhật nhanh
    manifest: true,
    rollupOptions: {
      output: {
        // Đảm bảo mỗi build tạo tên file khác nhau để tránh cache
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`
      }
    }
  },
  // Cấu hình để tránh cache khi phát triển
  cacheDir: '.vite-cache',
  optimizeDeps: {
    include: []
  }
})
