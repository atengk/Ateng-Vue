# Number-Flow

一个动画数字组件。相互间无依赖的。启动以后可使用的。可定制的。

- [官网地址](https://number-flow.barvian.me/)



## 基础配置

**安装依赖**

```
pnpm add @number-flow/vue@0.4.8 --filter @apps/number-flow
```



## 最简示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import NumberFlow from '@number-flow/vue'

/**
 * 当前数值
 */
const count = ref<number>(0)

/**
 * 自增
 */
const increase = (): void => {
  count.value++
}
</script>

<template>
  <div style="padding: 20px">
    <!-- 数字动画 -->
    <NumberFlow :value="count" />

    <!-- 操作按钮 -->
    <button style="margin-left: 12px" @click="increase">
      +1
    </button>
  </div>
</template>
```

1️⃣ NumberFlow 是一个 **组件**

```ts
import NumberFlow from '@number-flow/vue'
```

你直接把它当普通组件用即可。

------

2️⃣ 只需要传一个 `value`

```vue
<NumberFlow :value="count" />
```

- `value` **是响应式的**
- 当 `count` 改变时，组件自动触发数字过渡动画
- 不需要 watch
- 不需要手写动画逻辑

------

3️⃣ 默认效果已经足够明显

- 默认是**滚动式数字变化**
- 对于：
  - KPI 数字
  - 统计卡片
  - 金额变化
    这种场景已经可以直接用



## 加动画配置

```vue
<script setup lang="ts">
import { ref } from 'vue'
import NumberFlow from '@number-flow/vue'

/**
 * 当前数值
 */
const count = ref<number>(100)

/**
 * 自增
 */
const increase = (): void => {
  count.value += 50
}
</script>

<template>
  <div style="padding: 20px">
    <!-- 数字动画（带配置） -->
    <NumberFlow
      :value="count"
      :duration="600"
      easing="ease-out"
    />

    <button style="margin-left: 12px" @click="increase">
      +50
    </button>
  </div>
</template>
```

1️⃣ `duration` —— 动画时长

```vue
:NumberFlow :duration="600" />
```

- 单位：**毫秒**
- 常见推荐值：
  - `300`：按钮 / 微交互
  - `500 ~ 800`：统计数字（最常用）
  - `1000+`：大屏展示

------

2️⃣ `easing` —— 缓动曲线

```vue
easing="ease-out"
```

这是一个 **CSS easing 字符串**，常用值：

| easing              | 视觉感觉     | 推荐场景   |
| ------------------- | ------------ | ---------- |
| `linear`            | 匀速         | 纯数据展示 |
| `ease-in`           | 慢 → 快      | 不常用     |
| `ease-out`          | 快 → 慢      | **推荐**   |
| `ease-in-out`       | 慢 → 快 → 慢 | 大数字变化 |
| `cubic-bezier(...)` | 自定义       | 高端动效   |

示例：

```vue
easing="cubic-bezier(0.4, 0, 0.2, 1)"
```

> 这个就是 Material Design 默认缓动，非常耐看



## 格式化数字

```vue
<script setup lang="ts">
import { ref } from 'vue'
import NumberFlow from '@number-flow/vue'

/**
 * 当前数值
 */
const amount = ref<number>(100000)

/**
 * 增加金额
 */
const increase = (): void => {
  amount.value += 12345
}

/**
 * 千分位格式化
 */
const formatThousands = (value: number): string => {
  return value.toLocaleString()
}
</script>

<template>
  <div style="padding: 20px">
    <NumberFlow
        :value="amount"
        :duration="800"
        easing="ease-out"
        :formatter="formatThousands"
    />

    <button style="margin-left: 12px" @click="increase">
      +12,345
    </button>
  </div>
</template>

```

1️⃣ `formatter` 是一个函数

```ts
(value: number) => string
```

- 入参：**动画过程中每一帧的数值**
- 返回：**你希望展示的字符串**

------

2️⃣ `toLocaleString()` 是最稳妥的方案

```ts
value.toLocaleString()
```

优点：

- 原生
- 性能好
- 自动处理千分位
- 国际化友好



## 正负变化样式

```vue
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import NumberFlow from '@number-flow/vue'

/**
 * 当前值
 */
const value = ref<number>(1000)

/**
 * 上一次值
 */
const prevValue = ref<number>(value.value)

/**
 * 变化方向
 * up / down / same
 */
const trend = computed<'up' | 'down' | 'same'>(() => {
  if (value.value > prevValue.value) {
    return 'up'
  }
  if (value.value < prevValue.value) {
    return 'down'
  }
  return 'same'
})

/**
 * 模拟变化
 */
const increase = (): void => {
  value.value += Math.round(Math.random() * 200)
}

const decrease = (): void => {
  value.value -= Math.round(Math.random() * 200)
}

/**
 * 监听值变化，记录上一次值
 */
watch(value, (newVal, oldVal) => {
  prevValue.value = oldVal
})
</script>

<template>
  <div style="padding: 20px">
    <div
      :class="[
        'number-wrapper',
        trend === 'up' && 'is-up',
        trend === 'down' && 'is-down'
      ]"
    >
      <!-- 趋势图标 -->
      <span v-if="trend === 'up'" class="trend-icon">↑</span>
      <span v-if="trend === 'down'" class="trend-icon">↓</span>

      <!-- 数字动画 -->
      <NumberFlow
        :value="value"
        :duration="800"
        easing="ease-out"
        :formatter="(v) => v.toLocaleString()"
      />
    </div>

    <div style="margin-top: 12px">
      <button @click="increase">上涨</button>
      <button style="margin-left: 8px" @click="decrease">下跌</button>
    </div>
  </div>
</template>

<style scoped>
.number-wrapper {
  display: inline-flex;
  align-items: center;
  font-size: 24px;
  font-weight: 600;
  transition: color 0.3s;
}

.is-up {
  color: #52c41a;
}

.is-down {
  color: #ff4d4f;
}

.trend-icon {
  margin-right: 4px;
  font-size: 18px;
}
</style>
```

1️⃣ **变化方向 = 当前值 vs 上一次值**

```ts
watch(value, (newVal, oldVal) => {
  prevValue.value = oldVal
})
```

- 这是**最稳妥**的方式
- 不依赖动画生命周期
- 数据逻辑完全独立

------

2️⃣ `trend` 是一个纯计算结果

```ts
const trend = computed(() => { ... })
```

好处：

- 没有副作用
- 模板里语义非常清晰
- 方便后续封装

------

3️⃣ 样式切换在**容器层**

```vue
<div :class="['number-wrapper', trend === 'up' && 'is-up']">
```

👉 **永远不要去改 NumberFlow 内部样式**

## 倒计时

```vue
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import NumberFlow, { NumberFlowGroup } from '@number-flow/vue'

/**
 * 剩余秒数
 */
const remainSeconds = ref<number>(3661)

/**
 * 拆分时间
 */
const hh = computed(() => Math.floor(remainSeconds.value / 3600))
const mm = computed(() => Math.floor((remainSeconds.value % 3600) / 60))
const ss = computed(() => remainSeconds.value % 60)

/**
 * 定时器
 */
let timer: number | null = null

const start = (): void => {
  if (timer !== null) {
    return
  }

  timer = window.setInterval(() => {
    if (remainSeconds.value <= 0) {
      stop()
      return
    }
    remainSeconds.value--
  }, 1000)
}

const stop = (): void => {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(start)
onUnmounted(stop)
</script>

<template>
  <NumberFlowGroup>
    <div class="countdown">
      <NumberFlow
          :value="hh"
          :trend="-1"
          :format="{ minimumIntegerDigits: 2 }"
      />
      <NumberFlow
          prefix=":"
          :value="mm"
          :trend="-1"
          :digits="{ 1: { max: 5 } }"
          :format="{ minimumIntegerDigits: 2 }"
      />
      <NumberFlow
          prefix=":"
          :value="ss"
          :trend="-1"
          :digits="{ 1: { max: 5 } }"
          :format="{ minimumIntegerDigits: 2 }"
      />
    </div>
  </NumberFlowGroup>
</template>

<style scoped>
.countdown {
  display: inline-flex;
  align-items: baseline;
  font-size: 28px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
</style>
```

1️⃣ 不封装组件也 **必须用 `NumberFlowGroup`**

原因只有一个：

> **HH / MM / SS 是一个整体语义**

不用 `Group` 会出现：

- 秒跳了
- 分还没动
- 视觉割裂

------

2️⃣ 不用 formatter，是**刻意的**

```
const hh = computed(...)
const mm = computed(...)
const ss = computed(...)
```

这是为了：

- 秒变时，分钟不抖
- 59 → 00 更自然
- 数字滚动方向正确

👉 即使你不封装组件，这个拆法也必须保留。

------

3️⃣ `trend="-1"` 是倒计时的“安全锁”

```
:NumberFlow :trend="-1"
```

- 明确告诉组件：**永远向下**
- 避免边界情况下反向动画
- 页面写死反而更稳

------

4️⃣ `digits` 不是炫技，是「时间必需」

```
:digits="{ 1: { max: 5 } }"
```

否则：

- `59 → 00` 会走很奇怪的动画路径
- 尤其在高帧率屏幕上非常明显
