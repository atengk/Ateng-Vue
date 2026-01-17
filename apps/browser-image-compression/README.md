# Browser Image Compression

用于在网页浏览器中运行的图像压缩JavaScript模块。

- [官网地址](https://github.com/Donaldcwl/browser-image-compression)



## 基础配置

**安装依赖**

```
pnpm add browser-image-compression@2.0.2
```



## 最简示例

```vue
<template>
  <input
      type="file"
      accept="image/*"
      @change="handleChange"
  />
</template>

<script lang="ts" setup>
import imageCompression, { type Options as ImageCompressionOptions } from 'browser-image-compression';

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

  printFileSize('原始大小', file);

  const options: ImageCompressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  };

  try {
    const compressedFile: File = await imageCompression(file, options);
    printFileSize('压缩后大小', compressedFile);

    // 这里的 compressedFile 就是最终可以直接上传到后端的文件
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('图片压缩失败：', error.message);
    } else {
      console.error('图片压缩失败：未知错误', error);
    }
  }
};

/**
 * 打印文件大小（MB）
 */
const printFileSize = (label: string, file: File): void => {
  const sizeInMB: number = file.size / 1024 / 1024;
  console.log(`${label}：${sizeInMB.toFixed(2)} MB`);
};
</script>
```

## 压缩预览

```ts
<template>
  <div class="container">
    <input
        type="file"
        accept="image/*"
        @change="handleChange"
    />

    <div v-if="previewUrl" class="preview">
      <p>压缩后预览：</p>
      <img :src="previewUrl" alt="compressed preview" />
      <p class="size">文件大小：{{ compressedSize }} MB</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount } from 'vue';
import imageCompression, { type Options as ImageCompressionOptions } from 'browser-image-compression';

/**
 * 预览地址
 */
const previewUrl = ref<string | null>(null);

/**
 * 压缩后文件大小（MB）
 */
const compressedSize = ref<string>('');

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

  printFileSize('原始大小', file);

  const options: ImageCompressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  };

  try {
    const compressedFile: File = await imageCompression(file, options);

    printFileSize('压缩后大小', compressedFile);

    compressedSize.value = (compressedFile.size / 1024 / 1024).toFixed(2);

    updatePreview(compressedFile);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('图片压缩失败：', error.message);
    } else {
      console.error('图片压缩失败：未知错误', error);
    }
  }
};

/**
 * 更新图片预览
 */
const updatePreview = (file: File): void => {
  // 释放旧的 URL，防止内存泄漏
  if (previewUrl.value !== null) {
    URL.revokeObjectURL(previewUrl.value);
  }

  previewUrl.value = URL.createObjectURL(file);
};

/**
 * 打印文件大小（MB）
 */
const printFileSize = (label: string, file: File): void => {
  const sizeInMB: number = file.size / 1024 / 1024;
  console.log(`${label}：${sizeInMB.toFixed(2)} MB`);
};

/**
 * 组件卸载时释放 URL
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
}

.preview img {
  max-width: 240px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.size {
  font-size: 12px;
  color: #606266;
}
</style>
```

## 上传压缩后的图片

```vue
<template>
  <input
      type="file"
      accept="image/*"
      @change="handleChange"
  />
</template>

<script lang="ts" setup>
// import axios from 'axios'
import imageCompression, { type Options as ImageCompressionOptions } from 'browser-image-compression'

/**
 * 文件选择变更处理
 */
const handleChange = async (event: Event): Promise<void> => {
  const target = event.target
  if (!(target instanceof HTMLInputElement)) return

  const { files } = target
  if (!files || files.length === 0) return

  const file: File = files[0]!
  printFileSize('原始大小', file)

  // 压缩配置（你可以根据需求调大调小）
  const options: ImageCompressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  }

  try {
    const compressedFile: File = await imageCompression(file, options)
    printFileSize('压缩后大小', compressedFile)

    // ⭐ 关键：这里的 compressedFile 就是最终可直接上传给后端的文件
    await uploadToServer(compressedFile)

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('图片压缩失败：', error.message)
    } else {
      console.error('图片压缩失败：未知错误', error)
    }
  }

  // 防止连续上传同一个文件不触发 change
  target.value = ''
}

/**
 * 上传文件至后端
 * 这里假设你的后端采用 multipart/form-data 接收
 */
const uploadToServer = async (file: File): Promise<void> => {
  const formData = new FormData()
  formData.append('file', file) // ⬅️ 注意 key 要和后端一致

  try {
    /*const resp = await axios.post('/api/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })*/

    //console.log('上传成功：', resp.data)
    console.log('上传成功')
  } catch (error) {
    console.error('上传失败：', error)
  }
}

/**
 * 打印文件大小（MB）
 */
const printFileSize = (label: string, file: File): void => {
  const sizeInMB: number = file.size / 1024 / 1024
  console.log(`${label}：${sizeInMB.toFixed(2)} MB`)
}
</script>
```

## 压缩指定格式

```vue
<template>
  <input
      type="file"
      accept="image/*"
      @change="handleChange"
  />
</template>

<script lang="ts" setup>
import imageCompression, { type Options as ImageCompressionOptions } from 'browser-image-compression';

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
    fileType: 'image/webp',  // 强制统一输出为 WebP
    useWebWorker: true
  };

  try {
    const compressedFile: File = await imageCompression(file, options);

    // 强制修正文件名后缀为 .webp
    const webpFile: File = renameToWebp(compressedFile);

    console.group('📤 压缩后文件信息（统一转 WebP）');
    printFileInfo(webpFile);
    console.groupEnd();

    console.group('📊 压缩效果对比');
    printCompare(file, webpFile);
    console.groupEnd();

    // compressedFile 就是最终可以直接上传到后端的 WebP 文件
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('图片压缩失败：', error.message);
    } else {
      console.error('图片压缩失败：未知错误', error);
    }
  }
};

/**
 * 打印单个文件的详细信息
 */
const printFileInfo = (file: File): void => {
  const sizeInMB: number = file.size / 1024 / 1024;

  console.log('文件名称：', file.name);
  console.log('文件 MIME 类型：', file.type);          // 如 image/png、image/webp
  console.log('文件格式（后缀）：', getFileExtension(file.name)); // 如 png、webp
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

  // 去掉最后一个后缀（如果存在）
  const baseName: string = originalName.replace(/\.[^.]+$/, '');

  const newFileName: string = `${baseName}.webp`;

  return new File([file], newFileName, {
    type: 'image/webp',
    lastModified: Date.now()
  });
};

</script>
```

