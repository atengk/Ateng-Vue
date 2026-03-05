import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [NaiveUiResolver()]
        }),
        Components({
            resolvers: [NaiveUiResolver()]
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    }
});
