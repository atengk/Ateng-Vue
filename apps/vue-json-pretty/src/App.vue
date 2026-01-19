<template>
  <div style="padding: 16px;">
    <VueJsonPretty
        v-model:data="json"
        editable
        editableTrigger="dblclick"
        :showLineNumber="true"
        :showIcon="true"
        @change="onChange"
    />

    <div style="margin-top: 12px;">
      <strong>最新 JSON:</strong>
      <pre>{{ json }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

const json = ref<any>({
  name: "demo",
  version: 1,
  tags: ["vue", "ts"],
  nested: { hello: "world" }
})

// 当用户编辑结构/值时触发
function onChange(updatedJson: any) {
  console.log("JSON 更新:", updatedJson)
}
</script>
