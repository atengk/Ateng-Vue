/**
 * 用户状态
 */
export enum UserStatus {
    DISABLED = 0,
    ENABLED = 1
}

/**
 * 性别
 */
export enum Gender {
    UNKNOWN = 0,
    MALE = 1,
    FEMALE = 2
}

/**
 * 账号来源
 */
export enum UserSource {
    LOCAL = 'LOCAL',
    LDAP = 'LDAP',
    OAUTH = 'OAUTH'
}

/**
 * 用户状态文案映射
 */
export const USER_STATUS_LABEL: Record<number, string> = {
    0: '禁用',
    1: '启用'
}

/**
 * 性别文案映射
 */
export const GENDER_LABEL: Record<number, string> = {
    0: '未知',
    1: '男',
    2: '女'
}
