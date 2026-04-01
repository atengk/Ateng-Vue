<script setup>
import { ref } from 'vue'

const content = ref('')

const editorConfig = {
  UEDITOR_HOME_URL: '/static/UEditorPlus/',
  UEDITOR_CORS_URL: '/static/UEditorPlus/',
  serverUrl: 'http://localhost:12342/api/ueditor',
  serverHeaders: {
    'Authorization': 'Bearer 2385569970'
  },
  uploadServiceEnable: true,

  uploadServiceUpload(type, file, callback, option) {
    console.log('自定义上传类型:', type, file, option)

    // live pre-upload progress
    callback.progress(0.2)

    // 自己调用你的 API 上传
    const formData = new FormData()
    formData.append('file', file)

    fetch('http://localhost:12342/api/upload/file', {
      method: 'POST',
      body: formData,
    })
        .then(res => res.json())
        .then(data => {
          // 👇 返回给编辑器成功结构
          callback.success({
            state: 'SUCCESS',
            url: data.url,
            title: data.name,
            original: file.name,
          })
        })
        .catch(err => {
          callback.error('上传失败')
        })
  },
}

const deps = ['ueditor.config.js', 'ueditor.all.js']
</script>

<template>
  <vue-ueditor-wrap
      v-model="content"
      editor-id="editor-upload-service"
      :config="editorConfig"
      :editorDependencies="deps"
      style="height: 400px;"
  />
  <div>
    {{content}}
  </div>
</template>
