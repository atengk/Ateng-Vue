<script setup lang="ts">
import VScaleScreen from 'v-scale-screen'
</script>

<template>
  <v-scale-screen
      width="1920"
      height="1080"
      :body-overflow-hidden="false"
  >
    <div class="screen">
      <div class="header">bodyOverflowHidden = false</div>
      <div class="content">
        <div class="box left">左</div>
        <div class="box center">中</div>
        <div class="box right">右</div>
      </div>
      <div class="footer">你现在可以滚动页面</div>
    </div>
  </v-scale-screen>
</template>

<style scoped>
.screen { width: 100%; height: 100%; background: #020617; color: #fff; }
.header { height: 80px; line-height: 80px; background: #4c1d95; text-align: center; }
.content { height: calc(1080px - 200px); display: flex; padding: 40px; }
.box { height: 600px; line-height: 600px; border-radius: 12px; text-align: center; }
.left { width: 400px; background: #7c3aed; }
.center { width: 800px; background: #8b5cf6; margin: 0 40px; }
.right { width: 400px; background: #a78bfa; }
.footer { height: 120px; line-height: 120px; background: #5b21b6; text-align: center; }
</style>