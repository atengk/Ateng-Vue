<template>
  <div class="video-app">
    <div class="embla-viewport" ref="emblaRef">
      <div class="embla__container">
        <div
            v-for="(item, index) in videoList"
            :key="index"
            class="embla__slide"
        >
          <div class="video-card">
            <template v-if="shouldRender(index)">
              <video
                  ref="videoRefs"
                  :src="item.url"
                  class="video-player"
                  loop
                  playsinline
                  webkit-playsinline
                  preload="auto"
                  :muted="index !== currentIndex"
                  @click="togglePlay(index)"
                  @waiting="onVideoWaiting(index)"
                  @playing="onVideoPlaying(index)"
              ></video>

              <div class="video-ui">
                <div class="info-content">
                  <h3 class="author">@创作者 {{ item.id }}</h3>
                  <p class="title">{{ item.title }}</p>
                </div>
              </div>

              <div v-if="loadingStates[index]" class="video-loader">
                <div class="spinner"></div>
              </div>

              <div v-if="pausedStates[index]" class="play-hint">▶</div>
            </template>

            <div v-else class="placeholder"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="global-progress">
      <div class="progress-inner" :style="{ width: `${(currentIndex + 1) / videoList.length * 100}%` }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'
import emblaCarouselVue from 'embla-carousel-vue'
import type { EmblaOptionsType } from 'embla-carousel'

const videoList = [
  { id: 101, title: '壮丽的深海世界', url: 'https://vjs.zencdn.net/v/oceans.mp4' },
  { id: 102, title: 'Sintel 动画预告', url: 'https://media.w3.org/2010/05/sintel/trailer.mp4' },
  { id: 103, title: '大雄兔的日常', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 104, title: '极地风景欣赏', url: 'http://vjs.zencdn.net/v/oceans.mp4#t=10' },
  { id: 105, title: '城市流光溢彩', url: 'https://media.w3.org/2010/05/sintel/trailer.mp4#t=5' },
  { id: 106, title: '自然森林探秘', url: 'https://www.w3schools.com/html/mov_bbb.mp4#t=2' }
]

const options: EmblaOptionsType = {
  axis: 'y',
  loop: false,
  align: 'center',
  dragFree: false
}

const [emblaRef, emblaApi] = emblaCarouselVue(options)

const currentIndex = ref(0)
const slidesInView = ref<number[]>([0])
const pausedStates = ref<boolean[]>(new Array(videoList.length).fill(false))
const loadingStates = ref<boolean[]>(new Array(videoList.length).fill(false))

// --- 修复后的管理函数 ---
const handlePlayback = () => {
  const api = emblaApi.value
  if (!api) return

  const activeIndex = api.selectedScrollSnap()
  currentIndex.value = activeIndex

  const buffer = 2
  const renderSet = new Set<number>()
  for (let i = activeIndex - buffer; i <= activeIndex + buffer; i++) {
    if (i >= 0 && i < videoList.length) renderSet.add(i)
  }
  slidesInView.value = Array.from(renderSet)

  nextTick(() => {
    const players = document.querySelectorAll('.video-player') as NodeListOf<HTMLVideoElement>

    players.forEach((player) => {
      // 修复 1: 显式处理 player.src 可能为 undefined 的情况
      const sourceUrl = player.src || ''
      const playerIdx = videoList.findIndex(v => {
        const baseTrackUrl = v.url.split('#')[0]
        return sourceUrl.includes(baseTrackUrl)
      })

      if (playerIdx === activeIndex) {
        player.muted = false
        // 修复 2: 使用下划线忽略未使用的变量，并增加捕获
        player.play().catch((_) => {
          console.log("需要用户点击后才能播放声音")
          pausedStates.value[playerIdx] = true
        })
        pausedStates.value[playerIdx] = false
      } else {
        player.pause()
        player.muted = true
        if (Math.abs(playerIdx - activeIndex) > 1) {
          player.currentTime = 0
        }
      }
    })
  })
}

// 视频状态回调
const onVideoWaiting = (index: number) => { loadingStates.value[index] = true }
const onVideoPlaying = (index: number) => { loadingStates.value[index] = false }

const togglePlay = (index: number) => {
  const players = document.querySelectorAll('.video-player') as NodeListOf<HTMLVideoElement>
  // 修复 3: 增加更严谨的类型查找
  const targetUrl = videoList[index].url.split('#')[0]
  const player = Array.from(players).find(p => (p.src || '').includes(targetUrl))

  if (player) {
    if (player.paused) {
      player.play().catch(() => {})
      pausedStates.value[index] = false
    } else {
      player.pause()
      pausedStates.value[index] = true
    }
  }
}

watch(emblaApi, (api) => {
  if (!api) return
  api.on('select', handlePlayback)
  api.on('init', handlePlayback)
  nextTick(handlePlayback)
})

const shouldRender = (index: number) => slidesInView.value.includes(index)

onBeforeUnmount(() => {
  const players = document.querySelectorAll('.video-player') as NodeListOf<HTMLVideoElement>
  players.forEach(p => p.pause())
})
</script>

<style scoped>
.video-app {
  position: fixed;
  inset: 0;
  background: #000;
  overflow: hidden;
}

.embla-viewport { height: 100%; }
.embla__container { height: 100%; display: flex; flex-direction: column; }
.embla__slide { flex: 0 0 100%; height: 100%; position: relative; }

.video-card {
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 手机端建议用 cover */
}

/* UI 层 */
.video-ui {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px 20px;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: white;
  pointer-events: none;
}
.author { font-size: 1.1rem; margin-bottom: 8px; }
.title { font-size: 0.9rem; opacity: 0.8; }

/* 状态提示 */
.play-hint {
  position: absolute;
  font-size: 60px;
  color: rgba(255,255,255,0.4);
  pointer-events: none;
}

.video-loader {
  position: absolute;
  display: flex;
  align-items: center;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* 全局底部进度条 */
.global-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: rgba(255,255,255,0.2);
  z-index: 20;
}
.progress-inner {
  height: 100%;
  background: #ff0050; /* 抖音红 */
  transition: width 0.3s ease;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>