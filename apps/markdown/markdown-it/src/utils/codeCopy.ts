export function enableCodeCopy(container: HTMLElement) {
    const blocks = container.querySelectorAll('pre')

    blocks.forEach(pre => {
        // 防止重复添加
        if (pre.querySelector('.copy-btn')) return

        const codeEl = pre.querySelector('code')
        if (!codeEl) return

        const button = document.createElement('button')
        button.className = 'copy-btn'
        button.textContent = 'Copy'

        button.addEventListener('click', async () => {
            const code = codeEl.textContent ?? ''
            await navigator.clipboard.writeText(code)
            button.textContent = 'Copied!'
            setTimeout(() => {
                button.textContent = 'Copy'
            }, 1500)
        })

        pre.style.position = 'relative'
        pre.appendChild(button)
    })
}
