<template>
  <div class="page">
    <h2>XTerm Clipboard 完整示例</h2>
    <div class="terminal-wrapper">
      <div ref="el" class="terminal"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { ClipboardAddon } from '@xterm/addon-clipboard'
import '@xterm/xterm/css/xterm.css'

const el = ref(null)
let term
let fitAddon
let resizeHandler

onMounted(async () => {
  await nextTick()
  if (!el.value) return

  term = new Terminal({
    cursorBlink: true,
    fontSize: 14,
    scrollback: 5000,
    convertEol: true,
    fontFamily: 'Menlo, Monaco, Consolas, monospace',
    theme: {
      background: '#0d1117',
      foreground: '#c9d1d9',
      cursor: '#58a6ff'
    }
  })

  fitAddon = new FitAddon()
  term.loadAddon(fitAddon)

  // ClipboardAddon 处理粘贴
  term.loadAddon(new ClipboardAddon(term))

  term.open(el.value)
  fitAddon.fit()
  resizeHandler = () => fitAddon.fit()
  window.addEventListener('resize', resizeHandler)

  // 输出示例
  term.writeln('🎉 XTerm Clipboard 完整示例')
  term.writeln('你可以选中终端内容 Ctrl+C 复制')
  term.writeln('Ctrl+V 或右键粘贴外部文本到终端')

  // 处理 Ctrl+C 复制增强
  term.attachCustomKeyEventHandler((e) => {
    if (e.ctrlKey && e.key === 'c') {
      const selection = term.getSelection()
      if (selection) {
        navigator.clipboard.writeText(selection)
      }
      e.preventDefault()
      return false
    }
    return true
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
  term?.dispose()
})
</script>

<style scoped>
.page {
  padding: 16px;
}
.terminal-wrapper {
  background: #0d1117;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.terminal {
  width: 100%;
  height: 400px;
  /* 允许选中复制 */
  user-select: text;
}
</style>