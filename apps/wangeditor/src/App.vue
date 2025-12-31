<script setup lang="ts">
import {onBeforeUnmount, ref, shallowRef} from 'vue'
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import type {IDomEditor, IToolbarConfig} from '@wangeditor/editor'

import '@wangeditor/editor/dist/css/style.css'

/**
 * 富文本内容（HTML）
 */
const valueHtml = ref<string>('<p>Hello WangEditor</p>')

/**
 * Editor 实例引用
 */
const editorRef = shallowRef<IDomEditor | null>(null)

/**
 * 工具栏配置
 */
const toolbarConfig: Partial<IToolbarConfig> = {}

/**
 * 编辑器配置
 */
const editorConfig: Record<string, unknown> = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      customUpload(file: File, insertFn: any): void {
        const formData = new FormData()
        formData.append('file', file)

        fetch('/api/upload/image', {
          method: 'POST',
          body: formData
        })
            .then(res => res.json())
            .then(res => {
              // 假设后端返回 { url: string }
              insertFn(res.url)
            })
            .catch(() => {
              console.error('图片上传失败')
            })
      }
    }
  }
}

/**
 * 创建完成回调
 */
function handleCreated(editor: IDomEditor): void {
  editorRef.value = editor
}

/**
 * 组件卸载时销毁编辑器
 */
onBeforeUnmount(() => {
  editorRef.value?.destroy()
  editorRef.value = null
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
        @onCreated="handleCreated"
    />
  </div>
</template>
