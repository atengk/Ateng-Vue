import {defineConfig} from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue'
import monacoEditorPlugin from 'vite-plugin-monaco-editor-esm'

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    },
    plugins: [
        vue(),
        monacoEditorPlugin({
            languageWorkers: [
                'editorWorkerService',
                'typescript',
                'css',
                'html',
                'json',
            ]
        })
    ],
    worker: {
        format: 'es',
    },
});