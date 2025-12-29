<script setup lang="ts">

import UserCard from "@/components/user/UserCard.vue";
import {ref} from "vue";
import StatusTag from "@/components/user/StatusTag.vue";
import type {BaseListItem} from "@/components/user/BaseList.vue";
import BaseList from "@/components/user/BaseList.vue";

function handleSubmit() {
  console.log("handleSubmit");
}

const visible = ref(true);

/**
 * 列表数据
 */
const users = ref<BaseListItem[]>([
  { id: 1, name: 'Tom' },
  { id: 2, name: 'Jerry' },
  { id: 3, name: 'Lucy' }
])

/**
 * 编辑事件
 */
function edit(item: BaseListItem) {
  console.log('编辑用户：', item)
}

import { provide } from 'vue'

provide('userId', 1)
provide('readonly', true)

</script>

<template>
  <UserCard name="ateng" :age="18" @submit="handleSubmit" v-model:visible="visible">
    <template #header>
      <h3>编辑用户</h3>
    </template>

    <h4>内容</h4>

    <template #footer>
      <button >取消</button>
      <button >确定</button>
    </template>
  </UserCard>

  <StatusTag status="success">
    <template #default="{ status, text }">
      <span :class="status">{{ text }}</span>
    </template>
  </StatusTag>

  <BaseList :list="users">
    <template #default="{ item }">
      <span>{{ item.name }}</span>
      <button @click="edit(item)">编辑</button>
    </template>
  </BaseList>
</template>

<style scoped>

</style>