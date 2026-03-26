import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    base: '/',
    title: "阿腾网站",
    description: "阿腾网站描述",
    themeConfig: {
        logo: '/logo.png',
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {text: 'Home', link: '/'},
            {text: 'Examples', link: '/markdown-examples'},
            {text: 'Java', link: '/java/'}
        ],

        sidebar: {
            '/markdown-examples': [
                {
                    text: 'Examples',
                    items: [
                        {text: 'Markdown Examples', link: '/markdown-examples'},
                        {text: 'Runtime API Examples', link: '/api-examples'}
                    ]
                }
            ],
            '/java/': [
                {
                    text: 'Java',
                    collapsed: true, // 默认折叠
                    items: [
                        {text: 'JDK8', link: '/java/jdk8'},
                        {text: '并发', link: '/java/concurrent'}
                    ]
                },
                {
                    text: 'Java_Copy',
                    items: [
                        {text: 'JDK8_Copy', link: '/java/jdk8'},
                        {text: '并发_Copy', link: '/java/concurrent'}
                    ]
                }
            ]
        },

        socialLinks: [
            {icon: 'github', link: 'https://github.com/atengk'},
            {
                icon: {
                    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="30" fill="#6366f1"/>
</svg>`
                },
                link: 'https://gitee.com/xxx'
            }
        ],
        footer: {
            message: 'Released under MIT License',
            copyright: 'Copyright © 2026 阿腾'
        },
        editLink: {
            pattern: 'https://github.com/atengk/system/docs/:path',
            text: '在 GitHub 上编辑此页'
        },
        outline: {
            level: [2, 3],
            label: '目录'
        },
        search: {
            provider: 'local'
        },
        externalLinkIcon: true,
        docFooter: {
            prev: '上一页',
            next: '下一页'
        },
        darkModeSwitchLabel: '主题',
        darkModeSwitchTitle: '切换暗黑模式',
        lightModeSwitchTitle: '切换亮色模式',
        lastUpdated: {
            text: '最后更新',
            formatOptions: {
                dateStyle: 'short',
                timeStyle: 'short'
            }
        },
        returnToTopLabel: '返回顶部',
        sidebarMenuLabel: '菜单',
    },
    markdown: {
        lineNumbers: true
    }
})
