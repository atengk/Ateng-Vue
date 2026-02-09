<template>
  <div class="carousel-wrapper">
    <!-- 主图 -->
    <div class="embla embla--main">
      <div class="embla__viewport" ref="mainRef">
        <div class="embla__container">
          <div
              class="embla__slide"
              v-for="(img, index) in images"
              :key="index"
          >
            <div class="main-image">
              <img :src="img" alt="" />
            </div>
          </div>
        </div>
      </div>

      <!-- 主图箭头 -->
      <button class="embla__button embla__button--prev" @click="mainApi?.scrollPrev()">‹</button>
      <button class="embla__button embla__button--next" @click="mainApi?.scrollNext()">›</button>
    </div>

    <!-- 缩略图 -->
    <div class="embla embla--thumb">
      <div class="embla__viewport" ref="thumbRef">
        <div class="embla__container">
          <div
              class="embla__slide embla__slide--thumb"
              v-for="(img, index) in images"
              :key="index"
              :class="{ 'is-selected': selectedIndex === index }"
              @click="onThumbClick(index)"
          >
            <img :src="img" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import EmblaCarousel, { type EmblaOptionsType } from 'embla-carousel'

const images = [
  'https://picsum.photos/id/1015/1200/600',
  'https://picsum.photos/id/1016/1200/600',
  'https://picsum.photos/id/1020/1200/600',
  'https://picsum.photos/id/1024/1200/600',
  'https://picsum.photos/id/1027/1200/600',
]

const mainRef = ref<HTMLDivElement | null>(null)
const thumbRef = ref<HTMLDivElement | null>(null)

let mainApi: ReturnType<typeof EmblaCarousel> | null = null
let thumbApi: ReturnType<typeof EmblaCarousel> | null = null

const selectedIndex = ref(0)

/** 同步主图 → 缩略图 */
function syncThumb() {
  if (!mainApi || !thumbApi) return
  const index = mainApi.selectedScrollSnap()
  selectedIndex.value = index
  thumbApi.scrollTo(index)
}

/** 点击缩略图 */
function onThumbClick(index: number) {
  mainApi?.scrollTo(index)
}

onMounted(() => {
  if (!mainRef.value || !thumbRef.value) return

  mainApi = EmblaCarousel(mainRef.value, {
    loop: true,
  })

  thumbApi = EmblaCarousel(thumbRef.value, {
    containScroll: 'keepSnaps',
    dragFree: true,
  })

  syncThumb()
  mainApi.on('select', syncThumb)
  mainApi.on('reInit', syncThumb)
})

onBeforeUnmount(() => {
  mainApi?.destroy()
  thumbApi?.destroy()
})
</script>

<style scoped>
.carousel-wrapper {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 16px;
}

/* ===== 主图 ===== */
.embla--main {
  position: relative;
  margin-bottom: 12px;
}

.embla__viewport {
  overflow: hidden;
}

.embla__container {
  display: flex;
}

.embla__slide {
  flex: 0 0 100%;
}

.main-image {
  position: relative;
  padding-top: 56.25%;
}

.main-image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 箭头 */
.embla__button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
}

.embla__button--prev {
  left: 8px;
}

.embla__button--next {
  right: 8px;
}

/* ===== 缩略图 ===== */
.embla--thumb .embla__slide {
  flex: 0 0 20%;
  padding: 4px;
}

.embla__slide--thumb {
  cursor: pointer;
  opacity: 0.5;
  border-radius: 4px;
  overflow: hidden;
}

.embla__slide--thumb img {
  width: 100%;
  display: block;
}

.embla__slide--thumb.is-selected {
  opacity: 1;
  outline: 2px solid #409eff;
}
</style>
