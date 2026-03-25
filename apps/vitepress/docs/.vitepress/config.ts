import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "阿腾网站",
    description: "阿腾网站描述",
    themeConfig: {
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
            {icon: 'github', link: 'https://github.com/atengk'}
        ]
    }
})
