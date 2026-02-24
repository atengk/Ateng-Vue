<template>
  <div class="page">
    <section ref="heroRef" class="hero">
      <h1 class="title">Enterprise Dashboard</h1>
      <p class="subtitle">Advanced Motion Experience</p>
    </section>

    <section class="card-list">
      <div
          v-for="index in 4"
          :key="index"
          :ref="setCardRef"
          class="card"
      >
        <h3>Module {{ index }}</h3>
        <p>Elegant animated component</p>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue'
import { useMotion } from '@vueuse/motion'

/**
 * DOM Refs
 */
const heroRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])

/**
 * 安全收集 DOM
 * 这里使用 unknown 再做类型守卫
 */
const setCardRef = (el: unknown) => {
  if (el instanceof HTMLElement) {
    cardRefs.value.push(el)
  }
}

onMounted(async () => {
  await nextTick()

  /**
   * 标题动画
   */
  if (heroRef.value) {
    useMotion(heroRef.value, {
      initial: { opacity: 0, y: 40 },
      enter: {
        opacity: 1,
        y: 0,
        transition: {
          type: 'spring',
          stiffness: 120,
          damping: 14,
        },
      },
    })
  }

  /**
   * 卡片交错动画
   */
  cardRefs.value.forEach((el, index) => {
    useMotion(el, {
      initial: { opacity: 0, y: 60, scale: 0.95 },
      enter: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          delay: index * 120,
          type: 'spring',
          stiffness: 140,
          damping: 16,
        },
      },
    })
  })
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: white;
  padding: 80px 60px;
}

.hero {
  margin-bottom: 60px;
}

.title {
  font-size: 48px;
  font-weight: 700;
}

.subtitle {
  margin-top: 12px;
  font-size: 18px;
  color: #94a3b8;
}

.card-list {
  display: flex;
  gap: 24px;
}

.card {
  flex: 1;
  padding: 30px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.4),
      inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}
</style>