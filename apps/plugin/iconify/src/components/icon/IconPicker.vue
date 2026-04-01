<template>
  <div class="icon-picker">
    <!-- 触发器 -->
    <div class="trigger" @click="open = !open">
      <Icon
          v-if="modelValue"
          :icon="modelValue"
          width="18"
      />
      <span v-else class="placeholder">选择图标</span>
    </div>

    <!-- 面板 -->
    <div v-if="open" class="panel">
      <input
          v-model="keyword"
          class="search"
          placeholder="搜索图标"
      />

      <div class="grid">
        <div
            v-for="icon in filteredIcons"
            :key="icon"
            class="item"
            @click="select(icon)"
        >
          <Icon :icon="icon" width="20" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import mdi from '@iconify/json/json/mdi.json'

defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const open = ref(false)
const keyword = ref('')

const icons = Object.keys(mdi.icons).map(
    name => `mdi:${name}`
)

const filteredIcons = computed(() =>
    keyword.value
        ? icons.filter(i => i.includes(keyword.value))
        : icons
)

function select(icon: string) {
  emit('update:modelValue', icon)
  open.value = false
}
</script>

<style scoped>
.icon-picker {
  position: relative;
  width: 200px;
}

.trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid #dcdfe6;
  cursor: pointer;
}

.placeholder {
  color: #999;
}

.panel {
  position: absolute;
  z-index: 1000;
  top: 36px;
  width: 360px;
  background: #fff;
  border: 1px solid #dcdfe6;
  padding: 8px;
}

.search {
  width: 100%;
  margin-bottom: 8px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
  max-height: 240px;
  overflow: auto;
}

.item {
  cursor: pointer;
  text-align: center;
}

.item:hover {
  background: #f5f7fa;
}
</style>
