<template>
  <div class="org-wrapper">
    <!-- 搜索框 -->
    <div class="search-bar">
      <input
          v-model="keyword"
          placeholder="请输入部门名称"
          @input="handleSearch"
      />
      <button @click="resetSearch">重置</button>
    </div>

    <vue3-tree-org
        :data="treeData"
        :collapsable="true"
    >
      <!-- 自定义节点高亮 -->
      <template #default="{ node }">
        <div
            class="custom-node"
            :class="{ highlight: node.highlight }"
        >
          {{ node.label }}
        </div>
      </template>
    </vue3-tree-org>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface TreeNode {
  id: number
  label: string
  children?: TreeNode[]
  expand?: boolean
  highlight?: boolean
}

/**
 * 原始数据（不要直接改它）
 */
const originData: TreeNode = {
  id: 1,
  label: '总公司',
  expand: true,
  children: [
    {
      id: 2,
      label: '研发部',
      children: [
        { id: 3, label: '后端开发' },
        { id: 4, label: '前端开发' }
      ]
    },
    {
      id: 5,
      label: '市场部'
    }
  ]
}

/**
 * 页面绑定数据（深拷贝）
 */
const treeData = ref<TreeNode>(clone(originData))

const keyword = ref('')

/**
 * 搜索处理
 */
const handleSearch = () => {
  if (!keyword.value) {
    treeData.value = clone(originData)
    return
  }

  const newTree = clone(originData)
  filterTree(newTree, keyword.value.toLowerCase())
  treeData.value = newTree
}

/**
 * 递归筛选 + 自动展开
 */
const filterTree = (node: TreeNode, keyword: string): boolean => {
  let matched = node.label.toLowerCase().includes(keyword)

  if (node.children && node.children.length > 0) {
    const childrenMatch = node.children
        .map(child => filterTree(child, keyword))
        .some(Boolean)

    matched = matched || childrenMatch
  }

  node.expand = matched
  node.highlight = node.label.toLowerCase().includes(keyword)

  return matched
}

/**
 * 重置
 */
const resetSearch = () => {
  keyword.value = ''
  treeData.value = clone(originData)
}

/**
 * 简单深拷贝
 */
function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}
</script>

<style scoped>
.org-wrapper {
  height: 600px;
  border: 1px solid #eee;
  padding: 20px;
}

.search-bar {
  margin-bottom: 12px;
}

.search-bar input {
  padding: 6px 10px;
  margin-right: 8px;
}

.custom-node {
  padding: 8px 12px;
  background: #fff;
  border-radius: 6px;
  transition: all 0.2s;
}

/* 高亮样式 */
.highlight {
  background: #409eff;
  color: #fff;
  font-weight: bold;
}
</style>