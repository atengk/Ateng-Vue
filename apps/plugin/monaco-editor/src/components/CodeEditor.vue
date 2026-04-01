<template>
  <div class="monaco-container" ref="containerRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as monaco from 'monaco-editor'

// ======================================
// Props
// ======================================
interface Props {
  mode?: 'normal' | 'diff'
  modelValue?: string          // normal 或 diff 新内容
  original?: string            // diff 原始内容
  language?: MonacoLang
  theme?: MonacoTheme
  readOnly?: boolean
  lineNumbers?: 'on' | 'off'
  minimap?: boolean
}

type MonacoLang = 'typescript' | 'javascript' | 'json' | 'html' | 'css'
type MonacoTheme = 'vs' | 'vs-dark' | 'hc-black'

const props = withDefaults(defineProps<Props>(), {
  mode: 'normal',
  modelValue: '',
  original: '',
  language: 'typescript',
  theme: 'vs-dark',
  readOnly: false,
  lineNumbers: 'on',
  minimap: true
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'ready', editor: monaco.editor.IStandaloneCodeEditor | monaco.editor.IStandaloneDiffEditor): void
}>()

// ======================================
// State
// ======================================
const containerRef = ref<HTMLElement | null>(null)

let editor: monaco.editor.IStandaloneCodeEditor | null = null
let diffEditor: monaco.editor.IStandaloneDiffEditor | null = null
let originalModel: monaco.editor.ITextModel | null = null
let modifiedModel: monaco.editor.ITextModel | null = null
let resizeObserver: ResizeObserver | null = null

// ======================================
// Init
// ======================================
onMounted(() => {
  if (!containerRef.value) return

  if (props.mode === 'diff') {
    // ---------- diff 模式 ----------
    originalModel = monaco.editor.createModel(props.original, props.language)
    modifiedModel = monaco.editor.createModel(props.modelValue, props.language)

    diffEditor = monaco.editor.createDiffEditor(containerRef.value, {
      theme: props.theme,
      readOnly: props.readOnly,
      renderSideBySide: true,
      automaticLayout: false,
      smoothScrolling: true,
      lineNumbers: props.lineNumbers,
      minimap: { enabled: props.minimap },
      scrollBeyondLastLine: false,
    })

    diffEditor.setModel({
      original: originalModel,
      modified: modifiedModel
    })

    /** diff 模式只关注 modified 内容 */
    modifiedModel.onDidChangeContent(() => {
      const val = modifiedModel!.getValue()
      if (val !== props.modelValue) emits('update:modelValue', val)
    })

    emits('ready', diffEditor)
  } else {
    // ---------- normal 模式 ----------
    editor = monaco.editor.create(containerRef.value, {
      value: props.modelValue,
      language: props.language,
      theme: props.theme,
      readOnly: props.readOnly,
      lineNumbers: props.lineNumbers,
      minimap: { enabled: props.minimap },
      automaticLayout: false,
      scrollBeyondLastLine: false,
      smoothScrolling: true,
      renderLineHighlight: 'line',
    })

    editor.onDidChangeModelContent(() => {
      const val = editor!.getValue()
      if (val !== props.modelValue) {
        emits('update:modelValue', val)
      }
    })

    emits('ready', editor)
  }

  // ---------- 外部更新 modelValue ----------
  watch(
      () => props.modelValue,
      (val) => {
        if (props.mode === 'diff') {
          if (modifiedModel && modifiedModel.getValue() !== val) {
            modifiedModel.setValue(val || '')
          }
        } else if (editor && editor.getValue() !== val) {
          editor.setValue(val || '')
        }
      }
  )

  // ---------- 外部更新 original（仅 diff） ----------
  watch(
      () => props.original,
      (val) => {
        if (props.mode === 'diff' && originalModel && originalModel.getValue() !== val) {
          originalModel.setValue(val || '')
        }
      }
  )

  // ---------- 语言切换 ----------
  watch(
      () => props.language,
      lang => {
        if (props.mode === 'diff') {
          originalModel && monaco.editor.setModelLanguage(originalModel, lang)
          modifiedModel && monaco.editor.setModelLanguage(modifiedModel, lang)
        } else {
          const model = editor?.getModel()
          model && monaco.editor.setModelLanguage(model, lang)
        }
      }
  )

  // ---------- 主题切换 ----------
  watch(
      () => props.theme,
      theme => monaco.editor.setTheme(theme)
  )

  // ---------- ResizeObserver（生产推荐） ----------
  resizeObserver = new ResizeObserver(() => {
    editor?.layout()
    diffEditor?.layout()
  })
  resizeObserver.observe(containerRef.value)
})

// ======================================
// Dispose
// ======================================
onBeforeUnmount(() => {
  resizeObserver?.disconnect()

  if (editor) {
    const model = editor.getModel()
    editor.dispose()
    model?.dispose()
  }

  if (diffEditor) {
    diffEditor.dispose()
    originalModel?.dispose()
    modifiedModel?.dispose()
  }
})
</script>

<style scoped>
.monaco-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #2a2a2a;
}
</style>
