<template>
  <div p="6" bg="gray-100" class="space-y-6">

    <!-- 1. 弹窗出现 / 消失 -->
    <div>
      <button
          class="px-4 py-2 rounded bg-blue-500 text-white transition"
          @click="showModal = !showModal"
      >
        切换弹窗
      </button>

      <div
          v-if="showModal"
          class="fixed inset-0 flex items-center justify-center
               bg-black/40"
      >
        <div
            class="bg-white p-6 rounded shadow-lg
                 transform transition-all duration-300 ease-in-out
                 scale-100 opacity-100"
        >
          弹窗内容
        </div>
      </div>
    </div>

    <!-- 2. 折叠 / 展开 -->
    <div>
      <button
          class="px-4 py-2 rounded bg-green-500 text-white transition"
          @click="open = !open"
      >
        切换折叠
      </button>

      <div
          class="overflow-hidden transition-all duration-300 ease-in-out"
          :class="open ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'"
      >
        <div class="p-4 bg-white rounded shadow mt-2">
          这是可折叠内容区域
        </div>
      </div>
    </div>

    <!-- 3. 悬浮反馈 -->
    <div
        class="p-4 bg-white rounded shadow
             transition transform duration-200
             hover:shadow-lg hover:scale-105"
    >
      鼠标悬浮时放大并增强阴影
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showModal = ref(false)
const open = ref(false)
</script>