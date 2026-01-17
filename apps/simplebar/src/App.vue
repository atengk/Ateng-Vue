<template>
  <div class="wrapper">

    <p>上面的内容</p>

    <simplebar class="mini-scroll-x">
      <div class="row">
        <div
            v-for="i in 20"
            :key="i"
            class="cell"
        >
          {{ i }}
        </div>
      </div>
    </simplebar>

    <p>下面的内容</p>

  </div>
</template>

<script setup lang="ts">
</script>

<style>
/* 自定义滚动容器（横向） */
.mini-scroll-x {
  max-width: 300px;
  border: 1px solid #ccc;
  padding: 8px;

  /* ⭐ 横向滚动关键属性 */
  overflow-x: auto;
  overflow-y: hidden; /* 可选，避免上下滚动条 */
}

/* 横向排列 */
.row {
  display: inline-flex; /* ⭐ 保证横向撑开 */
  gap: 8px;
}

.cell {
  flex: 0 0 auto; /* ⭐ 不换行，保持宽度 */
  width: 100px;
  height: 80px;
  background: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
}
</style>
