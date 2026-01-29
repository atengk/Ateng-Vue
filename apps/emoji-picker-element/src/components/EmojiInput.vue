<template>
  <div class="emoji-input">
    <input
        :value="modelValue"
        @input="onInput"
        class="input"
    />
    <button @click="show = !show" class="btn">😀</button>
    <emoji-picker
        v-show="show"
        @emoji-click="onEmojiClick"
        class="picker"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const show = ref(false);

const onInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  emit('update:modelValue', value);
};

const onEmojiClick = (event: any) => {
  const emoji = event.detail.unicode;
  emit('update:modelValue', props.modelValue + emoji);
  show.value = false;
};
</script>

<style scoped>
.emoji-input {
  position: relative;
  display: flex;
  gap: 6px;
}

.input {
  flex: 1;
  padding: 6px 8px;
}

.btn {
  cursor: pointer;
}

.picker {
  position: absolute;
  top: 40px;
  right: 0;
  z-index: 999;
}
</style>
