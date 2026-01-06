export function enhanceCodeBlocks(container: HTMLElement): void {
    const pres = container.querySelectorAll('pre')

    pres.forEach((pre) => {
        if (pre.classList.contains('code-enhanced')) {
            return
        }

        const code = pre.querySelector('code')
        if (!code) {
            return
        }

        pre.classList.add('code-enhanced')

        const langClass = [...code.classList].find(c => c.startsWith('language-'))
        const lang = langClass ? langClass.replace('language-', '') : 'text'

        const wrapper = document.createElement('div')
        wrapper.className = 'code-wrapper'

        const header = document.createElement('div')
        header.className = 'code-header'

        header.innerHTML = `
      <span class="code-lang">${lang}</span>
      <button class="code-copy">复制</button>
    `

        const copyBtn = header.querySelector('.code-copy') as HTMLButtonElement
        copyBtn.onclick = async () => {
            await navigator.clipboard.writeText(code.textContent || '')
            copyBtn.textContent = '已复制'
            setTimeout(() => (copyBtn.textContent = '复制'), 1200)
        }

        pre.parentNode?.insertBefore(wrapper, pre)
        wrapper.appendChild(header)
        wrapper.appendChild(pre)
    })
}