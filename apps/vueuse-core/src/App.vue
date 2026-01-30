<template>
  <div class="app">
    <h1>VueUse - useBase64（图片）</h1>

    <input type="file" accept="image/*" @change="onImageChange" />
    <img v-if="imgSrc" ref="imgEl" :src="imgSrc" alt="preview" class="preview" />

    <div class="result" v-if="base64">
      <p><b>图片 Base64:</b></p>
      <textarea :value="base64" rows="40" readonly></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useBase64 } from '@vueuse/core'

// 初始化为 {} as HTMLImageElement 保证 TS 不报错
const imgEl = ref<HTMLImageElement>({} as HTMLImageElement)
const { base64, execute } = useBase64(imgEl)

// 图片 src
const imgSrc = ref('')

// 图片选择事件
const onImageChange = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  imgSrc.value = URL.createObjectURL(file)

  // 等待 img 渲染完成再执行 Base64
  await nextTick()
  // imgEl.value 已绑定到 template 中的 ref
  await execute()
}
</script>

<style scoped>
.app {
  padding: 24px;
  font-family: sans-serif;
}
.preview {
  display: block;
  max-width: 200px;
  margin: 12px 0;
}
textarea {
  width: 100%;
  padding: 6px;
  font-size: 12px;
}
</style>
