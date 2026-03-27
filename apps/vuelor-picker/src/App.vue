<script lang="ts" setup>
import { ref } from 'vue'

import {
  ColorPickerRoot,
  ColorPickerCanvas,
  ColorPickerSliderHue
} from '@vuelor/picker'

const color = ref(null)
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-6 rounded-2xl shadow-xl w-[300px] space-y-4">

      <!-- 标题 + 预览 -->
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">Mini Picker</h2>
        <div
            class="w-8 h-8 rounded-lg border"
            :style="{ background: color || 'transparent' }"
        />
      </div>

      <ColorPickerRoot
          v-model="color"
          class="space-y-3"
      >
        <!-- 色盘 -->
        <div class="rounded-xl overflow-hidden border">
          <ColorPickerCanvas class="w-full h-[160px]" />
        </div>

        <!-- 色相 -->
        <div class="h-3 rounded-full overflow-hidden border">
          <ColorPickerSliderHue class="w-full h-full" />
        </div>
      </ColorPickerRoot>

      <!-- 当前值 -->
      <div class="text-xs text-gray-500 text-center break-all">
        {{ color || '未选择颜色' }}
      </div>

    </div>
  </div>
</template>