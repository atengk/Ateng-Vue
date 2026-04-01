<template>
  <div class="autoplay-wrapper">
    <swiper
        :modules="modules"
        :autoplay="{ delay: 1000, disableOnInteraction: false }"
        @autoplayTimeLeft="onAutoplayTimeLeft"
        class="progress-swiper"
    >
      <swiper-slide v-for="i in 3" :key="i">Slide {{ i }}</swiper-slide>

      <template #container-end>
        <div class="autoplay-progress">
          <svg viewBox="0 0 48 48" ref="progressCircle">
            <circle cx="24" cy="24" r="20"></circle>
          </svg>
          <span ref="progressContent"></span>
        </div>
      </template>
    </swiper>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';
import { Autoplay } from 'swiper/modules';

const modules = [Autoplay];

const progressCircle = ref<SVGSVGElement | null>(null);
const progressContent = ref<HTMLElement | null>(null);

// 核心：利用 autoplayTimeLeft 回调实时更新进度条
const onAutoplayTimeLeft = (s: any, time: number, progress: number) => {
  if (progressCircle.value) {
    progressCircle.value.style.setProperty('--progress', String(1 - progress));
  }
  if (progressContent.value) {
    progressContent.value.textContent = `${Math.ceil(time / 1000)}s`;
  }
};
</script>

<style scoped>
.progress-swiper { height: 300px; background: #2c3e50; color: #fff; }

/* 进度条样式 */
.autoplay-progress {
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 10;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #42b883;
}

.autoplay-progress svg {
  --progress: 0;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  stroke-width: 4px;
  stroke: #42b883;
  fill: none;
  stroke-dasharray: 125.6;
  stroke-dashoffset: calc(125.6 * var(--progress));
  transform: rotate(-90deg);
}
</style>