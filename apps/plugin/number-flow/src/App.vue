<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import NumberFlow, { NumberFlowGroup } from '@number-flow/vue'

/**
 * 剩余秒数
 */
const remainSeconds = ref<number>(3661)

/**
 * 拆分时间
 */
const hh = computed(() => Math.floor(remainSeconds.value / 3600))
const mm = computed(() => Math.floor((remainSeconds.value % 3600) / 60))
const ss = computed(() => remainSeconds.value % 60)

/**
 * 定时器
 */
let timer: number | null = null

const start = (): void => {
  if (timer !== null) {
    return
  }

  timer = window.setInterval(() => {
    if (remainSeconds.value <= 0) {
      stop()
      return
    }
    remainSeconds.value--
  }, 1000)
}

const stop = (): void => {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(start)
onUnmounted(stop)
</script>

<template>
  <NumberFlowGroup>
    <div class="countdown">
      <NumberFlow
          :value="hh"
          :trend="-1"
          :format="{ minimumIntegerDigits: 2 }"
      />
      <NumberFlow
          prefix=":"
          :value="mm"
          :trend="-1"
          :digits="{ 1: { max: 5 } }"
          :format="{ minimumIntegerDigits: 2 }"
      />
      <NumberFlow
          prefix=":"
          :value="ss"
          :trend="-1"
          :digits="{ 1: { max: 5 } }"
          :format="{ minimumIntegerDigits: 2 }"
      />
    </div>
  </NumberFlowGroup>
</template>

<style scoped>
.countdown {
  display: inline-flex;
  align-items: baseline;
  font-size: 28px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
</style>
