<template>
  <QuillEditor v-model="content" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import QuillEditor from '@/components/QuillEditor.vue'

const content = ref('<p>初始内容</p>')
</script>
