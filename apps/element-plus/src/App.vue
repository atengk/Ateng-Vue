<template>
  <el-tooltip
      content="这是一段很长的文本内容，鼠标悬浮时完整展示"
      placement="top"
  >
    <div class="ellipsis">
      这是一段很长的文本内容...
    </div>
  </el-tooltip>
</template>

<script setup lang="ts">

</script>
<style scoped>
.ellipsis {
  width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
