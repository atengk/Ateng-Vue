// src/store/modules/tabs.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TabItem } from '@/router/types'

export const useTabsStore = defineStore('tabs', () => {
    const tabs = ref<TabItem[]>([])

    function addTab(tab: TabItem) {
        if (tabs.value.some(t => t.path === tab.path)) return
        tabs.value.push(tab)
    }

    function removeTab(path: string) {
        tabs.value = tabs.value.filter(t => t.path !== path)
    }

    function clearTabs() {
        tabs.value = []
    }

    return {
        tabs,
        addTab,
        removeTab,
        clearTabs
    }
})