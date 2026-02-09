<script setup lang="ts">
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide } from 'vue3-carousel'
import { ref, onMounted } from 'vue'

const isReady = ref(false)

const logs = [
  { id: 1, user: '张**', action: '签到成功' },
  { id: 2, user: '李**', action: '兑换奖品' },
  { id: 3, user: '王**', action: '完成任务' },
  { id: 4, user: '赵**', action: '加入群组' },
  { id: 5, user: '周**', action: '发表评论' }
]

onMounted(() => {
  isReady.value = true
})
</script>

<template>
  <div class="vertical-fix-container">
    <Carousel
        v-if="isReady"
        dir="ttb"
        :items-to-show="3"
        :autoplay="2000"
        :height="180"
        :transition="600"
        :mouse-drag="true"
        :touch-drag="true"
        :wrap-around="true"
        pause-autoplay-on-hover
    >
      <Slide v-for="log in logs" :key="log.id">
        <div class="log-card">
          <span class="user-tag">{{ log.user }}</span>
          <span class="text">{{ log.action }}</span>
        </div>
      </Slide>
    </Carousel>
  </div>
</template>

<style scoped>
.vertical-fix-container {
  border: 1px solid #444;
  background: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
  /* 关键点 2: 给容器一个确定的高度 */
  height: 180px;
}

.log-card {
  /* 关键点 3: Slide 内部必须填满高度 (180px / 3 = 60px) */
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: #fff;
  border-bottom: 1px solid #333;
  box-sizing: border-box; /* 必须加，否则高度计算溢出 */
}

.user-tag {
  background: #4f46e5;
  padding: 2px 8px;
  border-radius: 4px;
  margin-right: 10px;
  font-size: 12px;
}

/* 关键点 4: 强制覆盖内置样式，防止计算错位 */
:deep(.carousel__track) {
  display: flex;
  flex-direction: column !important;
  transform: none; /* 初始化时重置 */
}
</style>