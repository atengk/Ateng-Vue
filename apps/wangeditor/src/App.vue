<script setup lang="ts">
import { ref, shallowRef, onBeforeUnmount } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'

const valueHtml = ref('<p>Hello WangEditor</p>')
const editorRef = shallowRef()

const toolbarConfig = {}
const editorConfig = {
  placeholder: '请输入内容...'
}

onBeforeUnmount(() => {
  if (editorRef.value) {
    editorRef.value.destroy()
  }
})
</script>

<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        mode="default"
    />
    <Editor
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        mode="default"
        style="height: 300px"
        @onCreated="editorRef = $event"
    />
  </div>
</template>
