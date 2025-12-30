<script setup lang="ts">

import { isEmpty } from '@/utils/array'
import {ref} from "vue";

const tableData = ref<string[]>([])

if (isEmpty(tableData.value)) {
  console.warn('暂无数据')
}

import { uniqueBy } from '@/utils/array'

const list = [
  { id: 1, name: 'A' },
  { id: 1, name: 'A-重复' },
  { id: 2, name: 'B' }
]

const result = uniqueBy(list, 'id')

import { groupBy } from '@/utils/array'

const users = [
  { name: '张三', dept: '研发' },
  { name: '李四', dept: '研发' },
  { name: '王五', dept: '市场' }
]

const grouped = groupBy(users, item => item.dept)

import { flattenTree } from '@/utils/array'

const menuTree = [
  {
    id: 1,
    name: '系统管理',
    children: [
      { id: 2, name: '用户管理' }
    ]
  }
]

const flatList = flattenTree(menuTree, 'children')



</script>

<template>

</template>

<style scoped>

</style>