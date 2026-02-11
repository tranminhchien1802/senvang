import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Đảm bảo base là root path
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://senvang-jef9.onrender.com', // Backend của bạn trên Render
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    },
    // Cấu hình để hỗ trợ đồng bộ dữ liệu nhanh
    hmr: {
      overlay: false // Tắt overlay lỗi để không làm phiền khi phát triển
    }
  },
  preview: {
    // Khi chạy preview, proxy tới backend
    proxy: {
      '/api': {
        target: process.env.BACKEND_URL || 'https://senvang-backend-production.up.railway.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist', // Chỉ định rõ thư mục đầu ra
    assetsDir: 'assets', // Thư mục chứa tài nguyên
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
