# 混合内容示例

## 动态列表 + 过渡动画

<script setup>
import { ref } from 'vue'

const list = ref(['Vue', 'VitePress', 'Element Plus'])

const addItem = () => {
  list.value.push('New Item ' + Date.now())
}
</script>

<div class="list-box">
  <el-button type="primary" @click="addItem">
    添加
  </el-button>
  
  <transition-group name="fade">
    <div v-for="item in list" :key="item" class="item">
      {{ item }}
    </div>
  </transition-group>
</div>

<style lang="scss">
.list-box {
  margin-top: 20px;

  .item {
    padding: 10px;
    margin-top: 10px;
    background: #f5f7fa;
    border-radius: 6px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>