import {defineStore} from 'pinia'
import {computed, ref} from "vue";

export const useUserStore = defineStore('user', () => {
    // state
    const token = ref<string>('')
    const userInfo = ref<any>(null)

    // getters
    const isLogin = computed(() => !!token.value)

    // actions
    function setToken(value: string) {
        token.value = value
    }

    function setUserInfo(info: any) {
        userInfo.value = info
    }

    function logout() {
        token.value = ''
        userInfo.value = null
    }

    return {
        token,
        userInfo,
        isLogin,
        setToken,
        setUserInfo,
        logout
    }
})