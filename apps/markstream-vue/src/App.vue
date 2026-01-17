<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import MarkdownRender from 'markstream-vue'
import { streamContent } from '@/const/markdown'

/**
 * 输出容器引用
 */
const boxRef = ref<HTMLElement | null>(null)

/**
 * 是否自动滚动
 * 当用户手动向上滚动时关闭
 * 当用户回到接近底部时重新开启
 */
const autoScroll = ref(true)

/**
 * 当前流式内容
 */
const content = ref('')

/**
 * 处理用户滚动：
 * 只有当用户在底部附近时才继续自动滚动
 */
function handleScroll() {
  const el = boxRef.value
  if (!el) return

  const distanceToBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight

  // 距离底部小于 20px 认为用户在“底部”
  autoScroll.value = distanceToBottom < 20
}

/**
 * 当内容变化时，如果允许自动滚动，就滚动到底部
 */
watch(content, async () => {
  await nextTick()
  if (autoScroll.value && boxRef.value) {
    boxRef.value.scrollTop = boxRef.value.scrollHeight
  }
})

/**
 * 模拟流式输出
 */
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
  <div class="chatgpt-wrapper">
    <div class="chatgpt-content" ref="boxRef" @scroll="handleScroll">
      <MarkdownRender
          :content="content"
          code-block-light-theme="github-light"
      />
    </div>

    <button class="chatgpt-btn" @click="startStream">重新开始流式输出</button>
  </div>
</template>

<style scoped>
/* ====== 外层布局 ====== */
.chatgpt-wrapper {
  padding: 24px;
  background: #f7f7f8; /* ChatGPT 的灰背景 */
  min-height: 100vh;
}

/* ====== 内容容器（中间白色聊天框） ====== */
.chatgpt-content {
  max-width: 880px;
  height: 600px;
  margin: 0 auto 16px;
  padding: 24px;
  overflow-y: auto;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0,0,0,0.04);
  font-family: "Inter", "SF Pro Text", system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  color: #1f2937;
}

/* ===== 滚动条 ===== */
.chatgpt-content::-webkit-scrollbar {
  width: 8px;
}
.chatgpt-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 4px;
}
.chatgpt-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0,0,0,0.28);
}

/* ===================
   Markstream markdown 样式覆盖
   =================== */
:deep(.markstream-vue) {
  font-size: 15px;
}

/* 标题优化（ChatGPT 风） */
:deep(.markstream-vue h1),
:deep(.markstream-vue h2),
:deep(.markstream-vue h3),
:deep(.markstream-vue h4),
:deep(.markstream-vue h5),
:deep(.markstream-vue h6) {
  font-weight: 600;
  color: #111827;
  margin: 18px 0 12px;
  line-height: 1.35;
}

/* 段落 */
:deep(.markstream-vue p) {
  margin: 12px 0;
}

/* 列表 */
:deep(.markstream-vue ul),
:deep(.markstream-vue ol) {
  padding-left: 1.4em;
  margin: 10px 0;
}
:deep(.markstream-vue li) {
  margin: 4px 0;
}

/* 引用块 */
:deep(.markstream-vue blockquote) {
  border-left: 4px solid #d1d5db;
  background: #f9fafb;
  padding: 8px 12px;
  margin: 12px 0;
  color: #374151;
  border-radius: 4px;
}

/* 内联代码 */
:deep(.markstream-vue code:not(pre code)) {
  background: #f3f4f6;
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 90%;
  color: #d63384; /* 类似 ChatGPT */
}

/* 代码块 */
:deep(.markstream-vue pre) {
  background: #0d1117;
  color: #c9d1d9;
  padding: 14px 16px;
  border-radius: 8px;
  overflow: auto;
  margin: 12px 0;
  font-size: 14px;
  line-height: 1.45;
}

/* 表格（细线 + Padding） */
:deep(.markstream-vue table) {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 14px;
}
:deep(.markstream-vue th),
:deep(.markstream-vue td) {
  border: 1px solid #e5e7eb;
  padding: 8px 12px;
}
:deep(.markstream-vue th) {
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
:deep(.markstream-vue a) {
  color: #2563eb;
  text-decoration: underline;
}

/* ===== 操作按钮 ===== */
.chatgpt-btn {
  display: block;
  margin: 0 auto;
  padding: 8px 18px;
  border-radius: 6px;
  background: #10a37f;
  border: none;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
}
.chatgpt-btn:hover {
  background: #0e8c6c;
}
</style>
