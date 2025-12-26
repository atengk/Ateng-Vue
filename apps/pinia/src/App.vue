<script setup lang="ts">
import {ref} from 'vue'
import User from "@/views/User.vue";
import UserView from "@/views/UserView.vue";

const tab = ref<'user' | 'userView'>('user')
</script>

<template>
  <div class="tabs">
    <button @click="tab = 'user'">User</button>
    <button @click="tab = 'userView'">UserView</button>
  </div>

  <User v-if="tab === 'user'"/>
  <UserView v-else-if="tab === 'userView'"/>
  <User v-else/>
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