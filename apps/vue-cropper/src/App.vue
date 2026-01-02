<template>
  <div>
    <input type="file" accept="image/*" @change="onSelect" />

    <teleport to="body">
      <div v-if="visible" class="overlay">
        <div class="crop-dialog">
          <div class="header">
            <span>裁剪并压缩</span>
            <span class="close" @click="close">×</span>
          </div>

          <div class="body">
            <vue-cropper
                ref="cropperRef"
                :img="img"
                :autoCrop="true"
                :autoCropWidth="300"
                :autoCropHeight="300"
                :fixed="true"
                :fixedNumber="[1, 1]"
                :centerBox="true"
                :outputType="outputType"
                :outputSize="outputSize"
            />
          </div>

          <div class="footer">
            <button class="btn cancel" @click="close">取消</button>
            <button class="btn primary" @click="compress">压缩导出</button>
          </div>
        </div>
      </div>
    </teleport>

    <div v-if="result" style="margin-top: 16px">
      <p>压缩后图片：</p>
      <img :src="result" style="width: 160px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'

const visible = ref(false)
const img = ref('')
const result = ref<string | null>(null)
const cropperRef = ref<any>(null)

/**
 * vue-cropper 官方压缩配置
 * outputSize：0.1 ~ 1
 */
const outputType = ref<'jpeg' | 'png' | 'webp'>('jpeg')
const outputSize = ref(0.75)

function onSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  img.value = URL.createObjectURL(file)
  visible.value = true

  nextTick(() => {
    cropperRef.value?.refresh()
  })
}

function close() {
  visible.value = false
}

function compress() {
  cropperRef.value.getCropBlob((blob: Blob) => {
    if (!blob) return
    result.value = URL.createObjectURL(blob)
    close()
  })
}
</script>

<style scoped>
/* 仍然是你的标准模板样式 */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.crop-dialog {
  width: 520px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}
.header {
  height: 48px;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}
.close {
  cursor: pointer;
}
.body {
  height: 360px;
  padding: 12px;
}
.footer {
  padding: 12px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #eee;
}
.btn {
  min-width: 72px;
  height: 32px;
}
.btn.primary {
  background: #409eff;
  color: #fff;
}
</style>
