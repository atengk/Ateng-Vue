<script setup lang="ts">
//引入VueOfficePdf 组件
import VueOfficePdf from '@vue-office/pdf/lib/v3/vue-office-pdf'

const pdf = 'http://175.178.193.128:20033/kongyu/胶州湾过车数据质量评估-平台使用.pdf'

function renderedHandler() {
  console.log("渲染完成")
}

function errorHandler() {
  console.log("渲染失败")
}
</script>

<template>
  <VueOfficePdf
      :src="pdf"
      style="height: 100vh;"
      @rendered="renderedHandler"
      @error="errorHandler"
  />
</template>

<style scoped>
</style>