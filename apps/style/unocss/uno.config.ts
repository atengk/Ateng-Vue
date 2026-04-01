import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss';

export default defineConfig({
    presets: [
        presetUno(),
        presetAttributify(),
        presetIcons(),
    ],
    theme: {
        colors: {
            primary: '#3b82f6',    // 主色
            success: '#22c55e',    // 成功色
            warning: '#f59e0b',    // 警告色
            error: '#ef4444',      // 错误色
            background: '#f3f4f6', // 背景色
            text: '#111827',       // 默认文字色
        },
        spacing: {
            xs: '4px',
            sm: '8px',
            md: '16px',
            lg: '24px',
            xl: '32px',
            '2xl': '48px',
        },
        borderRadius: {
            none: '0px',
            sm: '4px',
            DEFAULT: '8px',
            lg: '12px',
            full: '9999px',
        },
        fontSize: {
            xs: '0.75rem',   // 12px
            sm: '0.875rem',  // 14px
            base: '1rem',    // 16px
            lg: '1.125rem',  // 18px
            xl: '1.25rem',   // 20px
            '2xl': '1.5rem', // 24px
            '3xl': '1.875rem', // 30px
        },
        fontFamily: {
            // 主字体
            sans: ['"Helvetica Neue"', 'Arial', 'sans-serif'],
            // 标题专用
            heading: ['"PingFang SC"', 'Microsoft YaHei', 'sans-serif'],
            // 等宽字体
            mono: ['"Fira Code"', 'Consolas', 'monospace'],
        },
    },
});