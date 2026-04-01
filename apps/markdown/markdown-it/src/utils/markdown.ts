import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

export const md = new MarkdownIt({
    html: true,
    linkify: true,
    breaks: true,
    highlight(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            const highlighted = hljs.highlight(code, { language: lang }).value
            return `<pre class="hljs"><code class="language-${lang}">${highlighted}</code></pre>`
        }
        const auto = hljs.highlightAuto(code).value
        return `<pre class="hljs"><code>${auto}</code></pre>`
    }
})


export function renderMarkdown(content: string): string {
    return md.render(content || '')
}
