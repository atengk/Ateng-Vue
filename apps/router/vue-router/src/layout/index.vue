<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTabsStore } from '@/store/modules/tabs'
import { generateBreadcrumbs } from '@/router/helper/breadcrumb'

const route = useRoute()
const tabsStore = useTabsStore()

/**
 * 面包屑
 */
const breadcrumbs = computed(() =>
    generateBreadcrumbs(route)
)

/**
 * keep-alive 缓存列表
 */
const cachedViews = computed(() =>
    tabsStore.tabs
        .filter(tab => tab.keepAlive)
        .map(tab => tab.name)
)
</script>

<template>
  <div class="layout">
    <!-- Header -->
    <header class="layout-header">
      <!-- 面包屑 -->
      <nav class="breadcrumb">
        <span
            v-for="(item, index) in breadcrumbs"
            :key="item.path"
        >
          {{ item.title }}
          <span v-if="index < breadcrumbs.length - 1"> / </span>
        </span>
      </nav>

      <!-- Tabs -->
      <div class="tabs">
        <span
            v-for="tab in tabsStore.tabs"
            :key="tab.path"
            class="tab"
        >
          {{ tab.title }}
        </span>
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="layout-main">
      <router-view v-slot="{ Component }">
        <keep-alive :include="cachedViews">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.layout-header {
  padding: 12px;
  border-bottom: 1px solid #e5e6eb;
}

.breadcrumb {
  font-size: 14px;
  margin-bottom: 8px;
}

.tabs {
  display: flex;
  gap: 8px;
}

.layout-main {
  flex: 1;
  padding: 16px;
  overflow: auto;
}
</style>
