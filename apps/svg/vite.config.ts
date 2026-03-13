import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import {createSvgIconsPlugin} from "vite-plugin-svg-icons";

export default defineConfig({
    plugins: [
        vue(),
        createSvgIconsPlugin({
            iconDirs: [path.resolve(process.cwd(), 'src/icons')], // 你的 svg 文件夹
            symbolId: 'icon-[name]', // 对应 <use href="#icon-xxx">
            inject: 'body-first',     // sprite 注入到 body 开头，确保页面加载时可用
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    }
});
