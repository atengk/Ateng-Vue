<!-- src/components/FileviewModalPreview.vue -->
<template>
  <section class="panel">
    <h2>模态弹窗预览</h2>

    <div class="grid">
      <label>
        文件地址
        <input v-model="form.url" type="text" />
      </label>

      <label>
        文件名
        <input v-model="form.fileName" type="text" />
      </label>

      <label>
        展示名称
        <input v-model="form.displayName" type="text" />
      </label>
    </div>

    <div class="actions">
      <button @click="openModal">弹窗预览</button>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="visible" class="modal-mask" @click.self="closeModal">
        <div ref="modalRef" class="modal-container">
          <div class="modal-header">
            <span>{{ form.displayName || form.fileName }}</span>
            <button @click="closeModal">关闭</button>
          </div>

          <div class="modal-body">
            <iframe
                v-if="iframeUrl"
                :src="iframeUrl"
                frameborder="0"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { useFileview } from '@/composables/useFileview'

const { buildPreviewUrl } = useFileview()

const visible = ref(false)
const modalRef = ref<HTMLElement | null>(null)
const { toggle: toggleFullscreen } = useFullscreen(modalRef)

const form = reactive({
  url: 'https://example.com/files/demo.pdf',
  fileName: 'demo.pdf',
  displayName: '弹窗预览示例',
})

const iframeUrl = ref('')

const previewUrl = computed(() =>
    buildPreviewUrl('query', {
      url: form.url,
      fileName: form.fileName,
      displayName: form.displayName,
      mode: 'embed',
    }),
)

/**
 * 打开弹窗并加载预览
 */
function openModal() {
  visible.value = true
  iframeUrl.value = previewUrl.value
}

/**
 * 关闭弹窗并销毁 iframe
 */
function closeModal() {
  visible.value = false
  iframeUrl.value = ''
}

/**
 * 如果参数变化，实时刷新 iframe
 */
watch(previewUrl, (val) => {
  if (visible.value) {
    iframeUrl.value = val
  }
})
</script>

<style scoped>
.panel {
  padding: 16px;
  border: 1px solid #dcdcdc;
  border-radius: 14px;
}

.grid {
  display: grid;
  gap: 12px;
}

label {
  display: grid;
  gap: 6px;
}

input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.actions {
  margin-top: 12px;
}

/* Modal 样式 */
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-container {
  width: 90%;
  height: 90%;
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #eee;
}

.modal-body {
  flex: 1;
}

iframe {
  width: 100%;
  height: 100%;
}
</style>