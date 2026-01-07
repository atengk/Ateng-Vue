<template>
  <IconPicker v-model="icon" />

  <p style="margin-top: 12px">
    当前选择：
    <Icon :icon="icon" width="20" />
    {{ icon }}
  </p>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import IconPicker from '@/components/icon/IconPicker.vue'

const icon = ref('')
</script>
