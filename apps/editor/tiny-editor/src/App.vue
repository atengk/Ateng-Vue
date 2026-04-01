<template>
  <div class="container">
    <div ref="editorRef" class="editor"></div>

    <h3>内容</h3>
    <pre>{{ html }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FluentEditor from '@opentiny/fluent-editor'

/** 编辑器 DOM 引用 */
const editorRef = ref<HTMLDivElement | null>(null)

/** editor 实例 */
let editor: FluentEditor | null = null

/** HTML 内容 */
const html = ref('')

onMounted(() => {
  if (!editorRef.value) return

  editor = new FluentEditor(editorRef.value, {
    theme: 'snow',
    placeholder: '请输入内容',
    modules: {
      i18n: {
        lang: 'zh-CN'
      }
    }
  })

  // 监听 Quill 的 text-change 事件
  editor.on('text-change', () => {
    // 直接从 DOM 获取 HTML
    html.value = editor?.root?.innerHTML ?? ''
  })
})
</script>

<style scoped>
.container {
  padding: 20px;
}

.editor {
  height: 400px;
  margin-bottom: 16px;
}
</style>