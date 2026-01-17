<template>
  <div class="container">
    <input
        type="file"
        accept="image/*"
        @change="handleChange"
    />

    <div v-if="previewUrl" class="preview">
      <p class="title">压缩后图片预览（WebP）</p>
      <img :src="previewUrl" alt="compressed webp" />
      <p class="info">
        文件名：{{ previewName }}
      </p>
      <p class="info">
        文件大小：{{ previewSize }} MB
      </p>
      <p class="info">
        文件类型：{{ previewType }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount } from 'vue';
import imageCompression, { type Options as ImageCompressionOptions } from 'browser-image-compression';

/**
 * 预览相关状态
 */
const previewUrl = ref<string | null>(null);
const previewName = ref<string>('');
const previewSize = ref<string>('');
const previewType = ref<string>('');

/**
 * 文件选择变更处理
 */
const handleChange = async (event: Event): Promise<void> => {
  const target = event.target;

  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  const { files } = target;
  if (files === null || files.length === 0) {
    return;
  }

  const file: File = files.item(0)!;

  console.group('📥 原始文件信息');
  printFileInfo(file);
  console.groupEnd();

  const options: ImageCompressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    fileType: 'image/webp',
    useWebWorker: true
  };

  try {
    const compressedFile: File = await imageCompression(file, options);

    const webpFile: File = renameToWebp(compressedFile);

    console.group('📤 压缩后文件信息（统一转 WebP + 修正后缀）');
    printFileInfo(webpFile);
    console.groupEnd();

    console.group('📊 压缩效果对比');
    printCompare(file, webpFile);
    console.groupEnd();

    updatePreview(webpFile);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('图片压缩失败：', error.message);
    } else {
      console.error('图片压缩失败：未知错误', error);
    }
  }
};

/**
 * 更新页面图片预览
 */
const updatePreview = (file: File): void => {
  if (previewUrl.value !== null) {
    URL.revokeObjectURL(previewUrl.value);
  }

  previewUrl.value = URL.createObjectURL(file);
  previewName.value = file.name;
  previewType.value = file.type;
  previewSize.value = (file.size / 1024 / 1024).toFixed(2);
};

/**
 * 打印单个文件的详细信息
 */
const printFileInfo = (file: File): void => {
  const sizeInMB: number = file.size / 1024 / 1024;

  console.log('文件名称：', file.name);
  console.log('文件 MIME 类型：', file.type);
  console.log('文件格式（后缀）：', getFileExtension(file.name));
  console.log('文件大小：', sizeInMB.toFixed(2), 'MB');
  console.log('最后修改时间：', new Date(file.lastModified).toLocaleString());
};

/**
 * 打印压缩前后的对比信息
 */
const printCompare = (originalFile: File, compressedFile: File): void => {
  const originalSize: number = originalFile.size / 1024 / 1024;
  const compressedSize: number = compressedFile.size / 1024 / 1024;

  const reduceSize: number = originalSize - compressedSize;
  const reducePercent: number = (reduceSize / originalSize) * 100;

  console.log('原始格式：', originalFile.type, `(${getFileExtension(originalFile.name)})`);
  console.log('压缩后格式：', compressedFile.type, `(webp)`);
  console.log('原始大小：', originalSize.toFixed(2), 'MB');
  console.log('压缩后大小：', compressedSize.toFixed(2), 'MB');
  console.log('减少体积：', reduceSize.toFixed(2), 'MB');
  console.log('压缩率：', reducePercent.toFixed(2), '%');
};

/**
 * 从文件名中提取后缀
 */
const getFileExtension = (fileName: string): string => {
  const index: number = fileName.lastIndexOf('.');
  if (index === -1) {
    return 'unknown';
  }
  return fileName.substring(index + 1).toLowerCase();
};

/**
 * 将文件名后缀强制改为 .webp
 */
const renameToWebp = (file: File): File => {
  const originalName: string = file.name || 'image';
  const baseName: string = originalName.replace(/\.[^.]+$/, '');
  const newFileName: string = `${baseName}.webp`;

  return new File([file], newFileName, {
    type: 'image/webp',
    lastModified: Date.now()
  });
};

/**
 * 组件卸载时释放 URL，防止内存泄漏
 */
onBeforeUnmount((): void => {
  if (previewUrl.value !== null) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview {
  margin-top: 12px;
  padding: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  width: fit-content;
}

.preview img {
  max-width: 260px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  display: block;
  margin-bottom: 8px;
}

.title {
  font-weight: 600;
  margin-bottom: 6px;
}

.info {
  font-size: 12px;
  color: #606266;
  line-height: 1.6;
}
</style>
