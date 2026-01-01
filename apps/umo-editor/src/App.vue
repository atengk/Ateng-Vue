<template>
  <umo-editor v-bind="options" />
  <div>
    {{htmlContent}}
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { UmoEditor } from '@umoteam/editor'

const htmlContent = ref('<p>这是从后端回显的内容</p>')

const options = ref({
  editorKey: 'demo',
  height: '600px', // 或 '50vh' / '600px'
  document: {
    title: '标题',
    placeholder: '请输入内容...',
    content: htmlContent.value
  },
  async onSave(content, page, document) {
    htmlContent.value = content.html
    return true
  },
  async onFileUpload(file) {
    // 这里你应该上传到后端
    // 示例：假装已经上传成功

    return {
      url: URL.createObjectURL(file),
      name: file.name
    }
  }
})
</script>
