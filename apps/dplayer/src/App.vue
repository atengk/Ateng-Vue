<template>
  <div>
    <div
        ref="containerRef"
        style="width: 100%; height: 360px; background: black"
    ></div>

    <div style="margin-top: 12px">
      <button @click="play">播放</button>
      <button @click="sendDanmaku">发送弹幕</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import DPlayer from 'dplayer'

const containerRef = ref<HTMLDivElement | null>(null)
const dp = ref<DPlayer | null>(null)

onMounted(async () => {
  await nextTick()

  dp.value = new DPlayer({
    container: containerRef.value!,
    video: {
      url: 'https://vjs.zencdn.net/v/oceans.mp4',
    },
    danmaku: true,
    danmaku: {
      id: 'demo', // ⚠️ 必须和后端 id 一致
      api: 'http://localhost:12342/danmaku/',
    },
  })

  console.log('DPlayer ready', dp.value)
})

onBeforeUnmount(() => {
  dp.value?.destroy()
})

function play() {
  dp.value?.video.play()
}

/**
 * 正确的弹幕发送方式（v3）
 */
function sendDanmaku() {
  if (!dp.value) return

  dp.value.danmaku.send({
    text: '这条弹幕一定能看到',
    color: 0xffffff,
    type: 0, // 0: 滚动
  })
}
</script>