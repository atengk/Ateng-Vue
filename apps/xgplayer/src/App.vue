<template>
  <div>
    <h2>Vue3 xgplayer 简单播放示例</h2>
    <!-- 播放器容器 -->
    <div ref="playerContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Player from 'xgplayer'
import 'xgplayer/dist/index.min.css';


// DOM 容器
const playerContainer = ref<HTMLDivElement | null>(null)
let player: Player | null = null

// 公网视频 URL
const videoUrl = 'https://vjs.zencdn.net/v/oceans.mp4'

onMounted(() => {
  if (playerContainer.value) {
    player = new Player({
      el: playerContainer.value,       // DOM 容器
      url: videoUrl,                   // 视频地址
      type: 'normal',                  // MP4
      width: 800,
      height: 450,
      poster: 'https://github.surmon.me/images/poster/oceans.png', // 封面
      watermark: 'https://your-logo-url.png', // 水印图片
      watermarkStyle: {
        right: '10px',
        top: '10px',
        width: '80px'
      }
    })

    // 事件监听
    player.on('play', () => console.log('播放开始'))
    player.on('pause', () => console.log('暂停'))
    player.on('ended', () => console.log('播放结束'))
  }
})

onBeforeUnmount(() => {
  if (player) {
    player.destroy()
    player = null
  }
})
</script>

<style scoped>
</style>