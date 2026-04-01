import {defineStore} from 'pinia'
import {ref, computed} from 'vue'
import type {UserProfile} from './types'

export const useUserStore = defineStore('user', () => {
    /**
     * state
     */
    const profile = ref<UserProfile | null>(null)
    const loaded = ref<boolean>(false)

    /**
     * getters
     */
    const hasProfile = computed(() => profile.value !== null)

    /**
     * actions
     */
    function setProfile(user: UserProfile) {
        profile.value = user
        loaded.value = true
    }

    function clearProfile() {
        profile.value = null
        loaded.value = false
    }

    /**
     * 示例：从接口加载用户信息
     * 注意：不在 Store 内直接处理 UI、副作用
     */
    async function fetchProfile() {
        if (loaded.value) {
            return
        }

        // const res = await getUserProfileApi()
        // setProfile(res.data)

        loaded.value = true
    }

    return {
        profile,
        loaded,
        hasProfile,
        setProfile,
        clearProfile,
        fetchProfile
    }
}, {
    persist: true
})
