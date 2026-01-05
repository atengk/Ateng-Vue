<template>
  <div class="page">
    <h2>图片上传 + 预览</h2>

    <el-upload
        action="#"
        list-type="picture-card"
        :auto-upload="false"
        :on-preview="handlePreview"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>

    <el-dialog v-model="previewVisible" title="图片预览">
      <img :src="previewUrl" class="preview-img" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'

const previewVisible = ref(false)
const previewUrl = ref('')

/**
 * 点击预览
 */
const handlePreview = (file: UploadFile) => {
  previewUrl.value = file.url!
  previewVisible.value = true
}
</script>

<style scoped>
.page {
  padding: 20px;
}

.preview-img {
  width: 100%;
}
</style>