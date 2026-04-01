<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import MarkdownRender from 'markstream-vue'
import { streamContent } from '@/const/markdown'

const boxRef = ref<HTMLElement | null>(null)
const autoScroll = ref(true)
const content = ref('')

function handleScroll() {
  const el = boxRef.value
  if (!el) return

  const distanceToBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight

  autoScroll.value = distanceToBottom < 20
}

watch(content, async () => {
  await nextTick()
  if (autoScroll.value && boxRef.value) {
    boxRef.value.scrollTop = boxRef.value.scrollHeight
  }
})

function startStream() {
  content.value = ''
  let i = 0
  const timer = setInterval(() => {
    if (i < streamContent.length) {
      content.value += streamContent[i++]
    } else {
      clearInterval(timer)
    }
  }, 3)
}

onMounted(() => {
  startStream()
})
</script>

<template>
  <div class="chat-container">
    <div class="chat-inner" ref="boxRef" @scroll="handleScroll">
      <MarkdownRender
          :content="content"
          code-block-light-theme="github-light"
          code-block-dark-theme="github-dark"
      />
    </div>
  </div>
</template>

<style scoped>
/* 外层容器 —— 填满整个屏幕高度 */
.chat-container {
  height: 100vh;
  background: #e9ecef; /* ChatGPT 背景色 可改 */
  display: flex;
  justify-content: center; /* 居中内部内容 */
  align-items: stretch;
  overflow: hidden; /* 防止双滚动条 */
}

/* 内部滚动容器 —— 所有内容都在里面滚动 */
.chat-inner {
  width: 100%;
  max-width: 880px; /* ChatGPT 内容宽度 */
  padding: 24px;
  overflow-y: auto;
  background: #ffffff;
  border-left: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
}

/* 滚动条弱化（像 ChatGPT） */
.chat-inner::-webkit-scrollbar {
  width: 8px;
}
.chat-inner::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.10);
  border-radius: 4px;
}
.chat-inner::-webkit-scrollbar-thumb:hover {
  background: rgba(0,0,0,0.18);
}

/* ===================
   Markstream markdown 样式覆盖（ChatGPT 风格）
   =================== */
:deep(.markstream-vue) {
  font-size: 15px;
  line-height: 1.65;
  color: #1f2937;
  font-family: "Inter", "SF Pro Text", system-ui, sans-serif;
}

/* 标题（真实结构） */
:deep(.markstream-vue .heading-1),
:deep(.markstream-vue .heading-2),
:deep(.markstream-vue .heading-3),
:deep(.markstream-vue .heading-4),
:deep(.markstream-vue .heading-5),
:deep(.markstream-vue .heading-6) {
  font-weight: 600;
  color: #111827;
  margin: 18px 0 12px;
  line-height: 1.35;
}

/* 段落 */
:deep(.markstream-vue .paragraph-node) {
  margin: 12px 0;
}

/* 列表 */
:deep(.markstream-vue .list-node) {
  padding-left: 1.4em;
  margin: 10px 0;
}
:deep(.markstream-vue .list-item) {
  margin: 4px 0;
  line-height: 1.6;
}

/* 引用块 */
:deep(.markstream-vue .blockquote) {
  border-left: 4px solid #d1d5db;
  background: #f9fafb;
  padding: 8px 12px;
  margin: 12px 0;
  color: #374151;
  border-radius: 4px;
}

/* 表格 */
:deep(.markstream-vue .table-node) {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
  font-size: 14px;
  border: 1px solid #e5e7eb;
}
:deep(.markstream-vue .table-node th),
:deep(.markstream-vue .table-node td) {
  border: 1px solid #e5e7eb;
  padding: 8px 12px;
}
:deep(.markstream-vue .table-node th) {
  background: #f3f4f6;
  font-weight: 600;
  color: #111827;
}

/* 图片自适应 */
:deep(.markstream-vue img) {
  max-width: 100%;
  border-radius: 6px;
  margin: 8px 0;
}

/* 链接 */
:deep(.markstream-vue .link-node) {
  color: #2563eb;
  text-decoration: underline;
}
</style>