<script setup lang="ts">
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide } from 'vue3-carousel'
</script>

<template>
  <Carousel
      dir="ttb"
      :items-to-show="1"
      :autoplay="2000"
      :height="500"
      wrap-around
  >
    <Slide v-for="n in 5" :key="n">
      <div class="notice">公告 {{ n }}</div>
    </Slide>
  </Carousel>
</template>

<style scoped>
.notice {
  height: 500px;
  display: flex;
  align-items: center;
  padding-left: 12px;
  background: #fdf6ec;
}
</style>
