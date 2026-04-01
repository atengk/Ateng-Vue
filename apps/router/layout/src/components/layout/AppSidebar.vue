<template>
  <aside class="sidebar">
    <router-link to="/">Dashboard</router-link>
    <router-link to="/system">System</router-link>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 160px;
  padding: 8px;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
