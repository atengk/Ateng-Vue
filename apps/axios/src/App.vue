<script setup lang="ts">
import {ref} from 'vue'
import List from '@/views/List.vue'
import Page from '@/views/Page.vue'
import Detail from "@/views/Detail.vue";
import Delete from "@/views/Delete.vue";
import Create from "@/views/Create.vue";
import Update from "@/views/Update.vue";
import Patch from "@/views/Patch.vue";
import Custom from "@/views/Custom.vue";

const tab = ref<'list' | 'page' | 'detail' | 'delete' | 'create' | 'update' | 'patch' | 'custom'>('list')
</script>

<template>
  <div class="tabs">
    <button @click="tab = 'list'">List</button>
    <button @click="tab = 'page'">Page</button>
    <button @click="tab = 'detail'">Detail</button>
    <button @click="tab = 'delete'">Delete</button>
    <button @click="tab = 'create'">Create</button>
    <button @click="tab = 'update'">Update</button>
    <button @click="tab = 'update'">Update</button>
    <button @click="tab = 'patch'">Patch</button>
    <button @click="tab = 'custom'">Custom</button>
  </div>

  <List v-if="tab === 'list'"/>
  <Detail v-else-if="tab === 'detail'"/>
  <Delete v-else-if="tab === 'delete'"/>
  <Create v-else-if="tab === 'create'"/>
  <Update v-else-if="tab === 'update'"/>
  <Patch v-else-if="tab === 'patch'"/>
  <Custom v-else-if="tab === 'custom'"/>
  <Page v-else/>
</template>

<style scoped>
.tabs {
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.tabs button {
  margin-right: 8px;
}
</style>