<template>
  <div style="height: 600px; display: flex; flex-direction: column; gap: 12px;">

    <!-- Diff Editor -->
    <CodeEditor
        mode="diff"
        :original="oldCode"
        v-model="newCode"
        language="typescript"
        theme="vs"
        @ready="onDiffReady"
    />

    <!-- 输出部分用来展示两份文本 -->
    <div style="display: flex; gap: 16px;">
      <div style="flex: 1; border:1px solid #bbb; padding: 6px; white-space: pre-wrap;">
        <strong>旧版本:</strong>
        <pre>{{ oldCode }}</pre>
      </div>
      <div style="flex: 1; border:1px solid #bbb; padding: 6px; white-space: pre-wrap;">
        <strong>新版本:</strong>
        <pre>{{ newCode }}</pre>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CodeEditor from '@/components/CodeEditor.vue'
import * as monaco from 'monaco-editor'

const oldCode = ref(`
function sum(a: number, b: number) {
  return a + b;
}
`)

const newCode = ref(`
function sum(a: number, b: number, log = false) {
  const result = a + b;
  if (log) console.log('Result:', result);
  return result;
}
`)

function onDiffReady(editor: monaco.editor.IStandaloneCodeEditor | monaco.editor.IStandaloneDiffEditor) {
  console.log('Diff Editor ready:', editor)
}
</script>
