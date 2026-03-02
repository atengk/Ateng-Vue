<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Options as SignaturePadOptions, PointGroup } from 'signature_pad'
import { useSignaturePad } from '@/composables/useSignaturePad'

const {
  signatureRef,
  toData,
  fromData,
  clear,
} = useSignaturePad()

const saved = ref<PointGroup[]>([])

const options = reactive<SignaturePadOptions>({
  penColor: '#000',
})

const save = () => {
  const data = toData()
  saved.value = data
}

const restore = () => {
  clear()
  fromData(saved.value)
}
</script>

<template>
  <Vue3Signature
      ref="signatureRef"
      :sigOption="options"
      w="700px"
      h="350px"
  />

  <button @click="save">保存数据</button>
  <button @click="restore">恢复数据</button>
</template>