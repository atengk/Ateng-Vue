<template>
  <div class="container">
    <h2>SQL 格式化（参数替换 + 禁用块）</h2>

    <!-- 方言 -->
    <div class="toolbar">
      <label>方言：</label>
      <select v-model="language">
        <option value="sql">sql</option>
        <option value="mysql">mysql</option>
        <option value="postgresql">postgresql</option>
      </select>
    </div>

    <!-- 参数 -->
    <div>
      <label>参数（JSON数组）</label>
      <textarea
          v-model="paramsText"
          class="textarea small"
          placeholder='["Alice", 18]'
      />
    </div>

    <!-- SQL -->
    <textarea v-model="inputSql" class="textarea" />

    <div class="actions">
      <button @click="handleFormat">格式化</button>
      <button @click="loadExample">加载示例</button>
    </div>

    <!-- 输出 -->
    <textarea v-model="outputSql" class="textarea output" readonly />

    <div class="tip">{{ tip }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { format } from 'sql-formatter'

// SQL
const inputSql = ref(`select * from user where name = ? and age > ?;`)

// 输出
const outputSql = ref('')

// 方言
const language = ref<'sql' | 'mysql' | 'postgresql'>('mysql')

// 参数 JSON
const paramsText = ref(`["Alice", 18]`)

// 提示
const tip = ref('')

// 解析参数（增强版）
const parseParams = (): string[] | undefined => {
  if (!paramsText.value.trim()) return undefined

  try {
    const parsed = JSON.parse(paramsText.value)

    if (!Array.isArray(parsed)) {
      tip.value = '参数必须是数组'
      return undefined
    }

    // 关键：全部转成 string
    return parsed.map(item => {
      if (item === null || item === undefined) return 'NULL'

      // 字符串自动加引号（可选增强）
      if (typeof item === 'string') {
        return `'${item}'`
      }

      return String(item)
    })

  } catch {
    tip.value = '参数 JSON 解析失败'
    return undefined
  }
}

// 格式化
const handleFormat = () => {
  try {
    tip.value = ''

    const params = parseParams()

    outputSql.value = format(inputSql.value, {
      language: language.value,
      ...(params ? { params } : {})
    })

    if (params) {
      tip.value = '格式化完成（已应用参数替换）'
    } else {
      tip.value = '格式化完成'
    }
  } catch (e) {
    outputSql.value = ''
    tip.value = '格式化失败: ' + (e as Error).message
  }
}

// 示例（避免方言冲突）
const loadExample = () => {
  inputSql.value = `
/* sql-formatter-disable */
select * from raw_table where a = 1;
/* sql-formatter-enable */

select * from user where name = ? and age > ?;
`
  paramsText.value = `["Bob", 25]`
}

// 初始自动格式化
onMounted(() => {
  handleFormat()
})
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 40px auto;
  font-family: Arial;
}

.textarea {
  width: 100%;
  min-height: 160px;
  margin-bottom: 10px;
  padding: 10px;
}

.small {
  min-height: 60px;
}

.output {
  background: #f5f5f5;
}

.tip {
  color: #666;
  font-size: 13px;
}
</style>