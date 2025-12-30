import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
    plugins: [vue()],

    // 项目根目录
    root: process.cwd(),

    // 部署基础路径
    base: '/',

    build: {
        // 构建输出目录
        outDir: 'dist',

        // 静态资源目录
        assetsDir: 'assets'
    },


    server: {
        // 本地开发端口
        port: 8888,

        // 监听地址
        host: '0.0.0.0',

        // 启动时自动打开浏览器
        open: true,

        // 端口被占用时直接报错
        strictPort: true,
        proxy: {
            '/api': {
                target: 'http://localhost:12007',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    }
})