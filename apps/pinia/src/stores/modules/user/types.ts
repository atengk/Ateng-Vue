/**
 * 用户基础信息
 */
export interface UserProfile {
    id: string
    username: string
    nickname: string
    avatar?: string
    email?: string
    phone?: string
}

/**
 * 用户状态 State
 */
export interface UserState {
    profile: UserProfile | null
    loaded: boolean
}
