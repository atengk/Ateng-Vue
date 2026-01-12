import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    },
    define: {
        global: 'window'  // 解决 @stomp/stompjs 访问 global 报错
    }
});
