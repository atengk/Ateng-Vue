<template>
  <div class="quill-wrapper">
    <div ref="editorRef"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

/**
 * Props 定义
 */
interface Props {
  modelValue: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

/**
 * 字体白名单（必须在 new Quill 之前注册）
 */
const Font = Quill.import('formats/font') as any
Font.whitelist = [
  'SimSun',
  'SimHei',
  'Microsoft-YaHei',
  'Arial',
]
Quill.register(Font, true)

/**
 * 编辑器实例
 */
const editorRef = ref<HTMLDivElement | null>(null)
let quill: Quill | null = null

/**
 * 工具栏配置
 */
const toolbarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ size: ['small', false, 'large', 'huge'] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ align: [] }],
  ['blockquote', 'code-block'],
  ['link', 'image', 'video'],
  ['clean'],
]

/**
 * 选择本地图片并插入
 */
function selectLocalImage(): void {
  if (!quill) {
    return
  }

  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.click()

  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file) {
      return
    }

    const imageUrl = await uploadImage(file)
    const range = quill!.getSelection(true)

    quill!.insertEmbed(range?.index ?? quill!.getLength(), 'image', imageUrl)
  }
}

/**
 * 上传图片（示例）
 */
async function uploadImage(file: File): Promise<string> {
  return URL.createObjectURL(file)
}

/**
 * 初始化编辑器
 */
function initEditor(): void {
  if (!editorRef.value) {
    return
  }

  quill = new Quill(editorRef.value, {
    theme: 'snow',
    placeholder: '请输入内容...',
    modules: {
      toolbar: {
        container: toolbarOptions,
        handlers: {
          image: selectLocalImage,
        },
      },
    },
  })

  quill.root.innerHTML = props.modelValue || ''

  quill.on('text-change', () => {
    emit('update:modelValue', quill!.root.innerHTML)
  })
}

/**
 * 生命周期
 */
onMounted(initEditor)

onBeforeUnmount(() => {
  quill = null
})

/**
 * 同步 v-model
 */
watch(
    () => props.modelValue,
    (value) => {
      if (!quill) {
        return
      }

      const html = value || ''
      if (html !== quill.root.innerHTML) {
        quill.root.innerHTML = html
      }
    }
)
</script>

<style scoped>
.quill-wrapper {
  border: 1px solid #dcdfe6;
}
</style>
