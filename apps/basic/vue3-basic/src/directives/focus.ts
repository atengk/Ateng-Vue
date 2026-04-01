import type { Directive } from 'vue'

const focus: Directive = {
    mounted(el: HTMLElement): void {
        el.focus()
    },
}

export default focus
