import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// https://vitejs.dev/config/
export default defineConfig({
  // 经 nginx /h5/ 子路径访问,资源引用需带上前缀
  base: '/h5/',
  plugins: [uni()],
  build: {
    // 微信开发者工具 babel 不支持 ES2020(?? / ?.)时降级到 es2015
    target: 'es2015',
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    allowedHosts: ['fastfoodhut.com', 'www.fastfoodhut.com'],
    proxy: {
      // 开发环境把 /api 代理到本地后端
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
