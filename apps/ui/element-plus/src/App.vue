<template>
  <el-image :src="imgUrl" style="width: 200px; height: 120px;" />
  <el-button @click="switchImg">切换图片</el-button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const list = [
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg'
];

const imgUrl = ref(list[0]);

const switchImg = () => {
  imgUrl.value = imgUrl.value === list[0] ? list[1] : list[0];
};
</script>
