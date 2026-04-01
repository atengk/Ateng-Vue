<template>
  <div id="print-area">
    <div class="print-header">
      用户信息报表
    </div>

    <div class="content">
      <p v-for="i in 40" :key="i">内容 {{ i }}</p>
    </div>

    <div class="print-footer">
      第 <span class="page"></span> 页
    </div>
  </div>

  <button v-print="'#print-area'">打印</button>
</template>

<script setup lang="ts"></script>

<style>
.print-header,
.print-footer {
  position: fixed;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 12px;
}

.print-header {
  top: 10mm;
}

.print-footer {
  bottom: 10mm;
}

@media print {
  body {
    margin: 20mm;
  }
}
</style>
