<template>
  <div class="qr-item">
    <h3>地理位置标记</h3>
    <QRCodeVue3
        :width="200"
        :height="200"
        value="geo:31.2304,121.4737"
        :dotsOptions="{ type: 'dots', color: '#f43f5e' }"
        :cornersSquareOptions="{ type: 'extra-rounded', color: '#be123c' }"
    />
    <p>坐标：上海人民广场</p>
  </div>
</template>

<script setup lang="ts">
import QRCodeVue3 from 'qrcode-vue3'
</script>