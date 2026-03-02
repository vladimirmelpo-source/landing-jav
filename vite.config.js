var _a;
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
    base: process.env.VITE_BASE_URL || '/',
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        proxy: {
            '/api': {
                target: (_a = process.env.VITE_API_BASE) !== null && _a !== void 0 ? _a : 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
});
